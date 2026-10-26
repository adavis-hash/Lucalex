# Lucalex (MODULO Modular Construction Systems)

A modern, premium e-commerce website for an original construction-toy brand inspired by architectural modularity and precision engineering. Built with **Next.js 16 (App Router)**, **React 19**, and **TypeScript**.

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the store.

## Tech Stack & Architecture

- **Framework**: Next.js 16.4 (App Router) + React 19
- **Styling**: Vanilla CSS Design System with custom design tokens (`app/globals.css`)
- **Typography**: Google Fonts (Plus Jakarta Sans & Space Grotesk) via `next/font/google`
- **Backend / Database Foundation**: Supabase (`@supabase/ssr`, `@supabase/supabase-js`, PostgreSQL, RLS)
- **Icons**: Lucide React + custom inline SVG brand emblems

## Project Structure

```
my-app/
├── app/                  # Next.js App Router pages and layout
│   ├── globals.css       # MODULO Design System tokens & utilities
│   ├── layout.tsx        # Root layout with fonts & metadata
│   └── page.tsx          # Storefront homepage
├── components/           # Reusable UI components
├── data/                 # Static catalog data & types
├── lib/
│   └── supabase/         # Browser, Server, and Admin Supabase clients
├── supabase/
│   └── migrations/       # Versioned SQL migrations & RLS policies
└── public/
    └── images/           # Studio model photography
```

## Supabase Configuration & Security

The application supports Supabase with cookie-based session management powered by `@supabase/ssr` and Row Level Security (RLS).

### Environment Variables (`.env.local`)

| Variable | Scope | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (Client & Server) | Your Supabase project URL (`https://<id>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public (Client & Server) | Publishable API key. Safe for browser bundles, constrained by RLS. |
| `SUPABASE_SECRET_KEY` | Private (Server-Only, Optional) | Secret Admin key that bypasses RLS. Strictly reserved for CLI/admin scripts (e.g. `scripts/seed.ts`). |

### Security Guarantees
1. **Row Level Security (RLS)**: Enforced across all tables. Standard storefront traffic (browsing, carts, profiles, orders) executes under user context with the publishable key.
2. **Cookie-Based Sessions**: Sessions are securely managed via HTTP cookies through `@supabase/ssr` (`lib/supabase/client.ts`, `lib/supabase/server.ts`, and `middleware.ts`).
3. **No Secret Key in Client**: `SUPABASE_SECRET_KEY` is never exposed in client components, never prefixed with `NEXT_PUBLIC_`, never sent in HTTP responses, and barred from browser execution via server-side runtime checks.

