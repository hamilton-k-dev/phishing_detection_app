export type ScanStatus = 'safe' | 'warning' | 'danger';
export type ScanResultType = 'safe' | 'suspicious' | 'phishing';

export interface CheckResult {
  value: string;
  status: ScanStatus;
  note: string;
}

export interface ScanDetails {
  domainAge: CheckResult;
  ssl: CheckResult;
  urlLength: CheckResult;
  keywords: CheckResult;
  externalLinks: CheckResult;
  reputation: CheckResult;
}

export interface AnalysisResult {
  result: ScanResultType;
  riskScore: number;
  details: ScanDetails;
}

const PHISHING_KEYWORDS = [
  'login', 'signin', 'sign-in', 'logon', 'log-in',
  'verify', 'verification', 'validate', 'confirm',
  'secure', 'security', 'alert', 'warning',
  'account', 'update', 'billing', 'payment', 'invoice',
  'password', 'passwd', 'credential', 'auth',
  'paypal', 'amazon', 'ebay', 'apple', 'microsoft', 'google',
  'facebook', 'netflix', 'instagram', 'twitter', 'tiktok',
  'bank', 'banking', 'wellsfargo', 'chase', 'citibank',
  'support', 'helpdesk', 'recover', 'reset',
  'suspended', 'locked', 'unusual', 'activity',
  'prize', 'winner', 'reward', 'claim', 'free',
];

const SUSPICIOUS_TLDS = new Set([
  '.xyz', '.tk', '.ml', '.ga', '.cf', '.gq', '.top',
  '.click', '.download', '.link', '.online', '.site',
  '.win', '.bid', '.stream', '.review', '.loan',
  '.cam', '.zip', '.mov', '.vip', '.club', '.work', '.icu',
]);

const URL_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly',
  'is.gd', 'buff.ly', 'adf.ly', 'short.link', 'cutt.ly',
  'rebrand.ly', 'tiny.cc', 'rb.gy', 'qr.ae',
]);

const KNOWN_BRANDS = [
  'paypal', 'amazon', 'apple', 'microsoft', 'google', 'facebook',
  'netflix', 'instagram', 'twitter', 'ebay', 'bank', 'chase',
  'wellsfargo', 'citibank', 'barclays', 'hsbc', 'linkedin',
];

const PRIVATE_HOST = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^0\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

function isPrivateHost(hostname: string): boolean {
  return PRIVATE_HOST.some(r => r.test(hostname));
}

async function checkSsl(url: string, hostname: string): Promise<'valid' | 'http' | 'error' | 'unknown'> {
  if (!url.startsWith('https://')) return 'http';
  if (isPrivateHost(hostname)) return 'unknown';

  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' });
    clearTimeout(tid);
    return res.status < 600 ? 'valid' : 'unknown';
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const isSslError = /cert|ssl|SSL|CERT|handshake|HANDSHAKE|self.sign/i.test(msg);
    return isSslError ? 'error' : 'unknown';
  }
}

export async function analyzeUrl(rawUrl: string): Promise<AnalysisResult> {
  let url = rawUrl.trim();
  if (!url.startsWith('http')) url = 'https://' + url;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Invalid URL format');
  }

  const hostname = parsed.hostname.toLowerCase();
  const fullUrl = url.toLowerCase();
  const pathAndQuery = parsed.pathname + parsed.search;
  const parts = hostname.split('.');
  const tld = parts.length >= 2 ? '.' + parts[parts.length - 1] : '';
  const domain = parts.slice(-2).join('.');
  const subdomains = parts.slice(0, -2);

  // ── SSL ──────────────────────────────────────────────────────────────────
  const sslState = await checkSsl(url, hostname);
  const sslCheck: CheckResult =
    sslState === 'valid'
      ? { value: 'Valid HTTPS', status: 'safe', note: 'Site uses HTTPS with an active SSL certificate.' }
      : sslState === 'http'
      ? { value: 'HTTP only', status: 'danger', note: 'No HTTPS detected — data is transmitted unencrypted.' }
      : sslState === 'error'
      ? { value: 'Certificate error', status: 'danger', note: 'SSL certificate could not be verified (possibly self-signed or expired).' }
      : { value: 'HTTPS (unverified)', status: 'warning', note: 'HTTPS is present but the site could not be reached for full certificate verification.' };

  // ── URL Length ───────────────────────────────────────────────────────────
  const urlLen = url.length;
  const urlLengthCheck: CheckResult =
    urlLen > 100
      ? { value: `${urlLen} chars`, status: 'danger', note: 'Very long URL — commonly used in phishing to disguise the real destination.' }
      : urlLen > 60
      ? { value: `${urlLen} chars`, status: 'warning', note: 'Moderately long URL — may contain obfuscated or misleading path segments.' }
      : { value: `${urlLen} chars`, status: 'safe', note: 'URL length is within the normal range for legitimate websites.' };

  // ── Reputation (computed first — needed for keyword filtering) ───────────
  const hasIP = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
  const hasSuspiciousTLD = SUSPICIOUS_TLDS.has(tld);
  const isShortener = URL_SHORTENERS.has(hostname);
  const hasAt = fullUrl.includes('@');
  const subdomainDepth = subdomains.length;
  const impersonatedBrand = KNOWN_BRANDS.find(brand => {
    if (!fullUrl.includes(brand)) return false;
    return hostname !== `${brand}.com` && hostname !== `www.${brand}.com` &&
      !hostname.endsWith(`.${brand}.com`);
  });

  // ── Suspicious Keywords ──────────────────────────────────────────────────
  // Brand-name keywords (e.g. "google", "paypal") are only flagged when the
  // domain is NOT the real brand — impersonation is the signal, not presence.
  const BRAND_KEYWORDS = new Set(KNOWN_BRANDS);
  const foundKeywords = PHISHING_KEYWORDS.filter(kw => {
    if (!fullUrl.includes(kw)) return false;
    if (BRAND_KEYWORDS.has(kw) && !impersonatedBrand) return false;
    return true;
  });
  const keywordsCheck: CheckResult =
    foundKeywords.length >= 3
      ? { value: `${foundKeywords.length} found`, status: 'danger', note: `Multiple high-risk keywords detected: "${foundKeywords.slice(0, 4).join('", "')}".` }
      : foundKeywords.length >= 1
      ? { value: `${foundKeywords.length} found`, status: 'warning', note: `Suspicious keyword${foundKeywords.length > 1 ? 's' : ''} detected: "${foundKeywords.join('", "')}".` }
      : { value: 'None found', status: 'safe', note: 'No phishing-related keywords found in the URL.' };

  const reputationFlags: string[] = [];
  if (hasIP) reputationFlags.push('IP address used as hostname');
  if (hasSuspiciousTLD) reputationFlags.push(`suspicious TLD (${tld})`);
  if (isShortener) reputationFlags.push('URL shortener service');
  if (impersonatedBrand) reputationFlags.push(`"${impersonatedBrand}" brand impersonation`);
  if (hasAt) reputationFlags.push('@ symbol redirect trick');
  if (subdomainDepth > 3) reputationFlags.push(`excessive subdomains (${subdomainDepth})`);

  const reputationCheck: CheckResult =
    reputationFlags.length >= 2 || hasIP || !!impersonatedBrand
      ? { value: 'High Risk', status: 'danger', note: `Serious risk indicators: ${reputationFlags.slice(0, 3).join('; ')}.` }
      : reputationFlags.length === 1
      ? { value: 'Suspicious', status: 'warning', note: `Risk indicator found: ${reputationFlags[0]}.` }
      : { value: 'No issues found', status: 'safe', note: 'Domain does not match known phishing patterns.' };

  // ── Domain Age Proxy ─────────────────────────────────────────────────────
  const hasManyNums = (domain.replace(/\./g, '').match(/\d/g) ?? []).length > 3;
  const hasHyphen = domain.includes('-');
  const dangerCount = [hasIP, !!impersonatedBrand, hasManyNums, subdomainDepth > 3].filter(Boolean).length;

  const domainAgeCheck: CheckResult =
    dangerCount >= 2
      ? { value: 'Suspicious pattern', status: 'danger', note: 'Domain structure matches patterns common in newly registered phishing domains.' }
      : dangerCount === 1 || (hasHyphen && hasSuspiciousTLD)
      ? { value: 'Uncertain', status: 'warning', note: 'Domain contains patterns sometimes associated with short-lived phishing sites.' }
      : { value: 'Appears established', status: 'safe', note: 'Domain structure is consistent with legitimate, established websites.' };

  // ── Redirects & Obfuscation ──────────────────────────────────────────────
  const REDIRECT_PARAMS = ['url=', 'redirect=', 'next=', 'goto=', 'link=', 'return=', 'returnurl=', 'redir='];
  const hasRedirectParam = REDIRECT_PARAMS.some(p => pathAndQuery.toLowerCase().includes(p));
  const hasEncodedChars = /%[0-9a-f]{2}/i.test(pathAndQuery);
  const pathDepth = parsed.pathname.split('/').filter(Boolean).length;

  const externalLinksCheck: CheckResult =
    hasRedirectParam || (isShortener && pathDepth >= 1)
      ? { value: 'Redirect detected', status: 'danger', note: 'URL contains redirect parameters that may forward users to a malicious destination.' }
      : hasEncodedChars || pathDepth > 5
      ? { value: 'Obfuscated path', status: 'warning', note: 'URL path uses encoding or excessive depth that may hide the real destination.' }
      : { value: 'No redirects', status: 'safe', note: 'No suspicious redirect patterns detected in the URL structure.' };

  // ── Risk Score ───────────────────────────────────────────────────────────
  let score = 0;

  if (sslState === 'http') score += 20;
  else if (sslState === 'error') score += 25;
  else if (sslState === 'unknown') score += 5;

  if (urlLen > 100) score += 15;
  else if (urlLen > 60) score += 7;

  score += Math.min(foundKeywords.length * 8, 30);

  if (hasIP) score += 25;
  if (hasSuspiciousTLD) score += 20;
  if (isShortener) score += 10;
  if (impersonatedBrand) score += 28;
  if (hasAt) score += 20;
  if (subdomainDepth > 3) score += 12;
  else if (subdomainDepth > 1) score += 5;
  if (hasManyNums) score += 8;
  if (hasHyphen && foundKeywords.length > 0) score += 8;
  if (hasRedirectParam) score += 15;
  if (hasEncodedChars) score += 8;

  score = Math.max(0, Math.min(score, 100));

  const result: ScanResultType = score >= 65 ? 'phishing' : score >= 25 ? 'suspicious' : 'safe';

  return {
    result,
    riskScore: score,
    details: {
      domainAge: domainAgeCheck,
      ssl: sslCheck,
      urlLength: urlLengthCheck,
      keywords: keywordsCheck,
      externalLinks: externalLinksCheck,
      reputation: reputationCheck,
    },
  };
}
