# Quick Start Guide

Get your AI Tool Finder up and running in 5 minutes!

## Step 1: Install

```bash
npm install
```

## Step 2: Supabase Setup

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to **SQL Editor** → Run `supabase/schema.sql`
4. Go to **Settings** → **API** → Copy credentials

## Step 3: Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 4: Run

```bash
npm run dev
```

Visit http://localhost:3000

## Step 5: Add Tools

Option A: Use admin page at `/admin`
Option B: Run seed script:

```bash
npx tsx scripts/seed.ts
```

## That's it! 🎉

Your app is ready. Start adding tools and ratings!

---

**Need help?** See [SETUP.md](./SETUP.md) for detailed instructions.
