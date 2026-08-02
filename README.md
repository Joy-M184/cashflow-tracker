# Cash Flow Tracker

AI-powered cash flow tracker SaaS — React + Vite frontend, Supabase for auth/database, Stripe for £5/month subscriptions, deployed on Vercel.

## Stack

- **Frontend**: React 19 + Vite
- **Auth & DB**: Supabase (Postgres + Row Level Security)
- **Payments**: Stripe Checkout (subscription mode)
- **Hosting**: Vercel (with a serverless function for Stripe)

## 1. Local setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with your real Supabase and Stripe keys (see below for where to get them).

```bash
npm run dev
```

## 2. Set up Supabase

1. Create a project at https://supabase.com
2. Go to **SQL Editor** and run everything in `supabase-schema.sql` — this creates the `transactions` and `subscriptions` tables with Row Level Security already switched on, so users can only ever see their own data.
3. Go to **Project Settings > API** and copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

## 3. Set up Stripe

1. Create a product in the Stripe Dashboard (**Product catalog**) priced at £5/month, recurring.
2. Copy the **Price ID** (starts `price_...`) → this goes in `STRIPE_PRICE_ID`
3. Go to **Developers > API keys**:
   - Publishable key → `VITE_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY` (server-side only, **never** put this in a `VITE_` variable or it'll leak to the browser)

## 4. Deploy to Vercel

This is where the last version broke, so a few notes:

- **Node version is pinned** via `.nvmrc` and `package.json engines` — Vercel will now use Node 20 automatically instead of guessing.
- **`vercel.json`** explicitly tells Vercel this is a Vite app and where the build output lives, so it won't misconfigure the build/output settings.
- The Stripe **secret** key lives only in `/api/create-checkout-session.js`, a serverless function — it never touches the frontend bundle. This avoids a common Vercel deploy trap where secret keys accidentally get bundled client-side.

Steps:

1. Push this project to a **new** GitHub repo (see below).
2. Go to https://vercel.com → **Add New Project** → import that repo.
3. In **Environment Variables**, add all the variables from `.env.example`, plus:
   - `STRIPE_SECRET_KEY` (server-only, no `VITE_` prefix)
   - `PUBLIC_URL` — your deployed URL, e.g. `https://your-app.vercel.app` (you'll know this after the first deploy; just add it and redeploy once)
4. Deploy.

## 5. Push to a fresh GitHub repo

```bash
cd cashflow-tracker
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_NEW_REPO.git
git push -u origin main
```

Create the empty repo on GitHub first at https://github.com/new (don't initialize it with a README — just create it empty, then push).

## What's built so far

- Email/password auth (Supabase Auth)
- Add/view/delete income & expense transactions
- Live income / expenses / net summary
- Basic rule-based "insight" on the dashboard (placeholder for a real AI call — see below)
- Stripe subscription checkout button, wired to a secure serverless function

## Next steps / ideas

- Swap the rule-based insight in `CashFlowSummary.jsx` for a real AI-generated insight by adding a serverless function that calls the Anthropic API with the user's transaction summary
- Add a Stripe webhook (`/api/stripe-webhook.js`) to update the `subscriptions` table when a payment succeeds — right now checkout works but subscription status isn't synced back yet
- Add charts (e.g. spending by category) using `recharts`
- Gate premium features (like AI insights) behind the `subscriptions.status === 'active'` check
