---
name: lucalex-feature-workflow
description: >-
  Standardized end-to-end workflow for designing, implementing, and verifying full-stack features in the Lucalex (MODULO) architecture. Use this skill when asked to build or modify UI components, Next.js 16 App Router pages/endpoints, Supabase data models and queries, RLS policies, or authentication flows.
---

# Lucalex (MODULO) Full-Stack Feature Workflow

This skill outlines the standard operating procedure for creating and updating full-stack features across the Lucalex codebase. All primary application code resides in the [`my-app/`](file:///c:/Users/alexa/OneDrive/Desktop/Lucalex/my-app) directory.

---

## 1. Architecture & Tech Stack Checklist

When implementing any feature, conform to the active stack in `my-app/`:

- **Framework**: Next.js 16.4+ (App Router) with React 19 and TypeScript.
- **Styling**: Vanilla CSS Design System with custom design tokens in [`app/globals.css`](file:///c:/Users/alexa/OneDrive/Desktop/Lucalex/my-app/app/globals.css).
- **Backend / Database**: Supabase PostgreSQL with `@supabase/ssr` and Row Level Security (RLS).
- **Icons**: `lucide-react` icons.
- **Package Manager**: `pnpm` (or `npm`).

---

## 2. End-to-End Implementation Steps

### Step 1: Plan the Feature & State Boundary
1. **Identify Server vs. Client Components**:
   - Keep data fetching and heavy backend interactions in **Server Components** or **Server Actions**.
   - Restrict `"use client"` solely to leaf components requiring user interactivity (forms, modals, interactive cart, filters).
2. **Review Next.js 16 Async API Rules**:
   - Dynamic APIs like `cookies()` and `headers()` from `next/headers`, as well as `params` and `searchParams` in page props, return Promises and **must be awaited**.

### Step 2: Database Schema & Supabase Client Selection
1. **Migrations & RLS**:
   - Place any new SQL migrations in [`supabase/migrations/`](file:///c:/Users/alexa/OneDrive/Desktop/Lucalex/my-app/supabase/migrations).
   - Ensure Row Level Security (RLS) is enabled on all tables:
     ```sql
     ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
     ```
   - Update [`types/database.types.ts`](file:///c:/Users/alexa/OneDrive/Desktop/Lucalex/my-app/types/database.types.ts) with corresponding TypeScript interfaces.
2. **Client Selection**:
   - **Server Components & Server Actions**: Use `createClient` from [`@/lib/supabase/server`](file:///c:/Users/alexa/OneDrive/Desktop/Lucalex/my-app/lib/supabase/server.ts):
     ```typescript
     import { createClient } from '@/lib/supabase/server';
     const supabase = await createClient();
     ```
   - **Browser / Client Components**: Use `createClient` from [`@/lib/supabase/client`](file:///c:/Users/alexa/OneDrive/Desktop/Lucalex/my-app/lib/supabase/client.ts):
     ```typescript
     'use client';
     import { createClient } from '@/lib/supabase/client';
     const supabase = createClient();
     ```
   - **Private Keys**: Never expose `SUPABASE_SECRET_KEY` in client components or prefix it with `NEXT_PUBLIC_`.

### Step 3: UI Design & Design System Compliance
1. **Design Tokens**:
   - Always reference the MODULO design tokens in `globals.css`:
     - Colors: `var(--color-primary)`, `var(--color-accent-blue)`, `var(--color-accent-amber)`, `var(--bg-page)`, `var(--bg-dark-card)`.
     - Shadows: `var(--shadow-sm)`, `var(--shadow-md)`, `var(--shadow-lg)`, `var(--shadow-glow-blue)`.
     - Radii: `var(--radius-sm)`, `var(--radius-md)`, `var(--radius-lg)`.
     - Typography: `var(--font-sans)` (Plus Jakarta Sans) and `var(--font-display)` (Space Grotesk).
2. **Aesthetic Standards**:
   - Avoid generic plain styling; preserve the architectural precision and tactile toy aesthetic.
   - Use subtle micro-interactions (`var(--transition-base)`), hover elevations, and responsive grid layouts.

### Step 4: Verification & Quality Assurance
Run validation commands inside `my-app/`:

1. **Linting Check**:
   ```bash
   pnpm run lint
   # or
   npm run lint
   ```
2. **Build & Typecheck**:
   ```bash
   pnpm run build
   # or
   npm run build
   ```
3. **Verify Dev Server**:
   Ensure no runtime warnings or unhandled exceptions appear in browser console or terminal.
