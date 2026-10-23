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
