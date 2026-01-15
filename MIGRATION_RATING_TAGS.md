# Migration: Add New Rating Tags

## Overview
This migration adds 4 new rating tags to the `ratings` table:
- `easy_to_use` - Easy to use
- `accurate` - Accurate
- `reliable` - Reliable
- `beginner_friendly` - Beginner friendly

## SQL Migration

Run this SQL in your Supabase SQL Editor:

```sql
ALTER TABLE ratings 
ADD COLUMN IF NOT EXISTS easy_to_use BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS accurate BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reliable BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS beginner_friendly BOOLEAN DEFAULT FALSE;
```

## Changes Made

1. **Database Schema** (`supabase/schema.sql`):
   - Added 5 new boolean columns to the `ratings` table

2. **TypeScript Types** (`lib/types.ts`):
   - Updated `Rating` interface to include new fields
   - Updated `RatingInput` interface to include new fields

3. **Rating Modal** (`components/RateToolModal.tsx`):
   - Added state for all 5 new tags
   - Added checkboxes in a 2-column grid layout
   - Updated form submission to include new tags
   - Updated existing rating loading to populate new fields

4. **API Route** (`app/api/ratings/route.ts`):
   - Updated POST endpoint to accept and save new tags
   - Updated GET endpoint to return new tags
   - Updated both INSERT and UPDATE operations

5. **Tool Details Page** (`app/tools/[slug]/page.tsx`):
   - Updated review display to show all new tags with color-coded badges

## Testing

After running the migration:
1. Open a tool details page
2. Click "Rate Tool"
3. Verify all 7 checkboxes appear (2 original + 5 new)
4. Submit a rating with some tags selected
5. Verify tags appear in the review display
6. Edit the review and verify tags are preserved
