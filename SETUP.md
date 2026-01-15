# Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy and paste the entire contents of `supabase/schema.sql`
5. Click **Run** to execute the schema

### 3. Get Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role** key (this is your `SUPABASE_SERVICE_ROLE_KEY`)

### 4. Create Environment File

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important**: Never commit `.env.local` to git. It's already in `.gitignore`.

### 5. Seed Sample Data (Optional)

To populate the database with sample tools:

```bash
# Set environment variables first
export NEXT_PUBLIC_SUPABASE_URL=your-url
export SUPABASE_SERVICE_ROLE_KEY=your-key

# Run seed script
npx tsx scripts/seed.ts
```

Or use the admin page at `/admin` to add tools manually.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Verification

1. **Home Page**: Should show empty state or seeded tools
2. **Search**: Try searching for a tool
3. **Categories**: Click category chips to filter
4. **Tool Detail**: Click on a tool card to see details
5. **Rating**: Click "Rate" button and submit a rating
6. **Compare**: Go to `/compare` and add tools to compare
7. **Admin**: Go to `/admin` to add new tools

## Troubleshooting

### Database Connection Issues

- Verify your Supabase URL and keys are correct
- Check that the schema was executed successfully
- Ensure your Supabase project is active (not paused)

### API Errors

- Check browser console for errors
- Verify environment variables are loaded (they start with `NEXT_PUBLIC_`)
- Check Supabase logs in the dashboard

### Build Errors

- Run `npm install` again
- Delete `.next` folder and rebuild
- Check Node.js version (should be 18+)

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set all three variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Security Notes

- The `SUPABASE_SERVICE_ROLE_KEY` should only be used server-side
- Never expose the service role key in client-side code
- The admin page (`/admin`) should be protected in production (add authentication)
- Rate limiting is built-in for ratings (24 hours per fingerprint)
