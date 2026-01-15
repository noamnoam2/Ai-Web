# AI Tool Finder

A clean, simple web app to discover and compare AI tools for creators. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔍 **Search & Filter**: Find AI tools by name, description, or category
- ⭐ **Ratings**: Rate tools with stars and quick toggles (Good for creators, Works in Hebrew, Worth the money)
- 📊 **Compare**: Side-by-side comparison of up to 3 tools
- 🎨 **Clean UI**: Minimal, mobile-first design focused on quick decision making
- 🌐 **RTL Support**: Hebrew-friendly interface (toggle ready)

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Get your project URL and anon key from Settings > API

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Tools Table
- `id` (UUID, primary key)
- `name` (VARCHAR)
- `slug` (VARCHAR, unique)
- `description` (TEXT)
- `url` (VARCHAR)
- `categories` (TEXT[])
- `pricing_type` (VARCHAR: Free, Freemium, Paid, Trial)
- `starting_price` (DECIMAL, optional)
- `created_at`, `updated_at` (TIMESTAMP)

### Ratings Table
- `id` (UUID, primary key)
- `tool_id` (UUID, foreign key)
- `stars` (INTEGER, 1-5)
- `good_for_creators` (BOOLEAN)
- `works_in_hebrew` (BOOLEAN)
- `worth_money` (BOOLEAN)
- `comment` (VARCHAR 200, optional)
- `anon_fingerprint_hash` (VARCHAR, for anti-spam)
- `ip_hash` (VARCHAR, optional)
- `created_at` (TIMESTAMP)

### Views
- `tool_stats`: Aggregated statistics per tool (ratings, percentages)

## Adding Tools

### Via Admin Page

1. Navigate to `/admin`
2. Fill in the form with tool details
3. Submit to create a new tool

### Via API

```bash
POST /api/admin/tools
Content-Type: application/json

{
  "name": "Example AI Tool",
  "slug": "example-ai-tool",
  "description": "A great AI tool for creators",
  "url": "https://example.com",
  "categories": ["Video", "Image"],
  "pricing_type": "Freemium",
  "starting_price": 9.99
}
```

## API Routes

### GET `/api/tools`
Query parameters:
- `query` (string): Search query
- `category` (string): Filter by category
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)

### GET `/api/tools/[slug]`
Get a single tool by slug with statistics.

### POST `/api/ratings`
Create a new rating. Body:
```json
{
  "tool_id": "uuid",
  "stars": 5,
  "good_for_creators": true,
  "works_in_hebrew": false,
  "worth_money": true,
  "comment": "Great tool!",
  "fingerprint_hash": "hashed_fingerprint"
}
```

Rate limiting: One rating per tool per fingerprint per 24 hours.

### GET `/api/compare?slugs=a,b,c`
Compare up to 3 tools by their slugs.

## Anti-Spam Protection

- Anonymous ratings are allowed but limited
- Uses client-side fingerprint hashing (localStorage ID + user agent)
- Server-side rate limiting: 1 rating per tool per fingerprint per 24 hours
- Optional IP hashing for additional protection

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin page
│   ├── compare/          # Compare page
│   ├── tools/[slug]/     # Tool detail page
│   └── page.tsx          # Home page
├── components/           # React components
├── lib/                  # Utilities and types
├── supabase/             # Database schema
└── public/               # Static assets
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Node.js

Make sure to set all environment variables in your deployment platform.

## Future Enhancements

- User authentication (optional)
- Advanced filtering and sorting
- Tool collections/bookmarks
- Email notifications for new tools
- Admin dashboard for managing tools
- Analytics and insights

## License

MIT
