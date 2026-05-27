# PhishGuard

A phishing URL detection app built with Next.js. Paste any suspicious link and get an instant risk assessment — no account required to scan.

## Features

- **Instant URL scanning** — heuristic analysis of SSL, domain age patterns, URL structure, suspicious keywords, and brand impersonation
- **0–100 risk score** — with a per-factor breakdown (safe / suspicious / phishing)
- **Public scanning** — scan without an account; results are accessible via shareable link
- **Scan history & dashboard** — sign in to save all scans, view analytics charts, and filter past results
- **Authentication** — email/password registration and login via better-auth

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Auth | better-auth v1 |
| Database | Neon PostgreSQL (serverless) |
| ORM | Prisma 7 with `@prisma/adapter-neon` |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Toasts | Sonner |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file at the project root:

```env
DATABASE_URL="postgresql://..."          # pooled Neon connection string
DATABASE_URL_DIRECT="postgresql://..."   # direct Neon connection string (for migrations)
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

`DATABASE_URL` is used at runtime (pooled). `DATABASE_URL_DIRECT` is used by Prisma CLI for migrations.

### 3. Run database migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. (Optional) Seed a demo account

```bash
npx tsx prisma/seed.ts
```

Creates `demo@phishguard.com` / `demo1234`.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Sign-in page
│   │   └── register/       # Registration page
│   ├── api/
│   │   ├── auth/           # better-auth handler
│   │   ├── scan/           # POST /api/scan, GET /api/scan/[id]
│   │   └── scans/          # GET /api/scans (authenticated history)
│   ├── dashboard/          # StatsCards, ScanLineChart, ScanPieChart, RecentScans
│   ├── history/            # Full scan history with filter + search
│   ├── result/[id]/        # Per-scan result detail page
│   ├── scan/               # URL input page
│   ├── LandingPage.tsx     # Public landing page (unauthenticated home)
│   └── page.tsx            # Root — landing page or dashboard based on auth
├── components/
│   ├── DashboardLayout.tsx # Sidebar + top nav (authenticated)
│   ├── PublicLayout.tsx    # Fixed header with sign-in link (public pages)
│   ├── Sidebar.tsx
│   └── TopNav.tsx
├── lib/
│   ├── auth.ts             # better-auth server config
│   ├── auth-client.ts      # better-auth client (signIn, signUp, signOut)
│   ├── db.ts               # Prisma client with Neon adapter
│   └── scanner.ts          # Core heuristic analysis engine
└── proxy.ts                # Route guard (replaces middleware in Next.js 16)
```

## How Scanning Works

`src/lib/scanner.ts` runs six checks against any URL:

| Check | What it looks for |
|---|---|
| **SSL** | Real HTTP HEAD request — valid HTTPS, HTTP only, or cert error |
| **URL length** | URLs over 60 / 100 chars are progressively flagged |
| **Keywords** | 30+ phishing terms in path/query; brand names only flagged when impersonating |
| **Reputation** | IP hostname, suspicious TLD, URL shortener, brand impersonation, `@` redirect trick |
| **Domain age proxy** | Heuristic patterns common in newly registered phishing domains |
| **Redirects** | Open redirect params (`url=`, `redirect=`, etc.) and encoded path obfuscation |

The final risk score (0–100) maps to: **< 25 → safe**, **25–64 → suspicious**, **≥ 65 → phishing**.

## Routes

| Path | Access | Description |
|---|---|---|
| `/` | Public | Landing page (guests) or dashboard (signed in) |
| `/scan` | Public | URL scanner |
| `/result/[id]` | Public | Scan result; guests see a "sign up" banner |
| `/history` | Auth required | Full scan history with filters |
| `/login` | Guest only | Sign in |
| `/register` | Guest only | Create account |
| `POST /api/scan` | Public | Run a scan |
| `GET /api/scan/[id]` | Public | Fetch a scan result |
| `GET /api/scans` | Auth required | Fetch the current user's scan history |
