export type ScanResult = 'safe' | 'suspicious' | 'phishing';

export interface ScanEntry {
  id: string;
  url: string;
  result: ScanResult;
  riskScore: number;
  timestamp: string;
  domain: string;
}

export const scanHistory: ScanEntry[] = [
  { id: '1', url: 'https://paypal-secure-login.xyz/verify', result: 'phishing', riskScore: 94, timestamp: '2026-04-07 14:32', domain: 'paypal-secure-login.xyz' },
  { id: '2', url: 'https://google.com', result: 'safe', riskScore: 2, timestamp: '2026-04-07 14:18', domain: 'google.com' },
  { id: '3', url: 'https://amazon-account-update.net/login', result: 'phishing', riskScore: 88, timestamp: '2026-04-07 13:55', domain: 'amazon-account-update.net' },
  { id: '4', url: 'https://github.com/openai/gpt-4', result: 'safe', riskScore: 4, timestamp: '2026-04-07 13:40', domain: 'github.com' },
  { id: '5', url: 'https://free-iphone-winner.click/claim', result: 'phishing', riskScore: 97, timestamp: '2026-04-07 13:12', domain: 'free-iphone-winner.click' },
  { id: '6', url: 'https://bankofamerica-verify.info/secure', result: 'suspicious', riskScore: 62, timestamp: '2026-04-07 12:48', domain: 'bankofamerica-verify.info' },
  { id: '7', url: 'https://microsoft.com/en-us/security', result: 'safe', riskScore: 1, timestamp: '2026-04-07 12:30', domain: 'microsoft.com' },
  { id: '8', url: 'https://netflix-billing-update.com/payment', result: 'suspicious', riskScore: 71, timestamp: '2026-04-07 11:55', domain: 'netflix-billing-update.com' },
  { id: '9', url: 'https://apple.com/icloud', result: 'safe', riskScore: 3, timestamp: '2026-04-07 11:20', domain: 'apple.com' },
  { id: '10', url: 'https://crypto-bonus-claim.io/wallet', result: 'phishing', riskScore: 91, timestamp: '2026-04-07 10:45', domain: 'crypto-bonus-claim.io' },
  { id: '11', url: 'https://dropbox.com/s/shared-doc', result: 'safe', riskScore: 5, timestamp: '2026-04-07 10:10', domain: 'dropbox.com' },
  { id: '12', url: 'https://instagram-verify-account.net', result: 'suspicious', riskScore: 55, timestamp: '2026-04-07 09:38', domain: 'instagram-verify-account.net' },
  { id: '13', url: 'https://linkedin.com/in/johndoe', result: 'safe', riskScore: 2, timestamp: '2026-04-07 09:15', domain: 'linkedin.com' },
  { id: '14', url: 'https://dhl-parcel-tracking.xyz/track', result: 'phishing', riskScore: 83, timestamp: '2026-04-07 08:50', domain: 'dhl-parcel-tracking.xyz' },
  { id: '15', url: 'https://twitter.com/elonmusk', result: 'safe', riskScore: 3, timestamp: '2026-04-07 08:22', domain: 'twitter.com' },
];

export const scanTimelineData = [
  { date: 'Mar 8', safe: 12, suspicious: 3, phishing: 2 },
  { date: 'Mar 10', safe: 18, suspicious: 5, phishing: 4 },
  { date: 'Mar 12', safe: 15, suspicious: 4, phishing: 3 },
  { date: 'Mar 14', safe: 22, suspicious: 6, phishing: 5 },
  { date: 'Mar 16', safe: 19, suspicious: 3, phishing: 2 },
  { date: 'Mar 18', safe: 25, suspicious: 7, phishing: 6 },
  { date: 'Mar 20', safe: 28, suspicious: 5, phishing: 4 },
  { date: 'Mar 22', safe: 21, suspicious: 8, phishing: 7 },
  { date: 'Mar 24', safe: 30, suspicious: 6, phishing: 5 },
  { date: 'Mar 26', safe: 26, suspicious: 4, phishing: 3 },
  { date: 'Mar 28', safe: 32, suspicious: 9, phishing: 8 },
  { date: 'Mar 30', safe: 35, suspicious: 7, phishing: 6 },
  { date: 'Apr 1', safe: 29, suspicious: 5, phishing: 4 },
  { date: 'Apr 3', safe: 38, suspicious: 10, phishing: 9 },
  { date: 'Apr 5', safe: 42, suspicious: 8, phishing: 7 },
  { date: 'Apr 7', safe: 45, suspicious: 11, phishing: 10 },
];

export const topDomains = [
  { domain: 'paypal-secure-login.xyz', scans: 47, result: 'phishing' as ScanResult },
  { domain: 'google.com', scans: 38, result: 'safe' as ScanResult },
  { domain: 'amazon-account-update.net', scans: 31, result: 'phishing' as ScanResult },
  { domain: 'github.com', scans: 28, result: 'safe' as ScanResult },
  { domain: 'netflix-billing-update.com', scans: 22, result: 'suspicious' as ScanResult },
  { domain: 'microsoft.com', scans: 19, result: 'safe' as ScanResult },
];
