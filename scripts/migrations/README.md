# Database Migrations

This directory contains sequential migration files for setting up the StudyPath database in Supabase.

## Migration Order

Run these files **in order** in your Supabase SQL Editor:

1. **01_initial_schema.sql** - Creates all tables
2. **02_row_level_security.sql** - Enables RLS on all tables
3. **03_users_policies.sql** - Sets up user table policies
4. **04_subjects_chapters_policies.sql** - Sets up subjects and chapters policies
5. **05_user_progress_policies.sql** - Sets up user progress policies
6. **06_feed_posts_policies.sql** - Sets up feed posts policies
7. **07_functions_and_triggers.sql** - Creates database functions and triggers
8. **08_sample_data.sql** - Inserts sample data

## How to Run Migrations

### Option 1: Automated (Recommended)

```bash
npm run migrate
```

### Option 2: Manual Instructions

```bash
npm run migrate:manual
```

### Option 3: Manual Step-by-Step

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the content of each migration file
5. Click **Run** to execute
6. Repeat for each file in order

## What Each Migration Does

### 01_initial_schema.sql

- Creates all database tables (users, subjects, chapters, user_progress, feed_posts)
- Sets up foreign key relationships
- Includes the `media_url` field for feed posts

### 02_row_level_security.sql

- Enables Row Level Security on all tables
- This is required for proper access control

### 03_users_policies.sql

- Users can only view/update their own profile
- Users can create their own profile

### 04_subjects_chapters_policies.sql

- Anyone can view subjects and chapters (public read)
- Admin write permissions (for future admin features)

### 05_user_progress_policies.sql

- Users can only view/update their own progress
- Users can create their own progress records

### 06_feed_posts_policies.sql

- Anyone can view feed posts (public read)
- Users can create/update/delete their own posts

### 07_functions_and_triggers.sql

- Auto-updates user points and rank when progress is made
- Auto-updates subject chapter counts

### 08_sample_data.sql

- Inserts sample subjects and chapters
- Provides initial data for testing

## Troubleshooting

### "Policy already exists" Error

If you get this error, it means you've already run some migrations. You can:

1. Skip the migration that's failing
2. Or run the individual SQL commands without the CREATE POLICY parts

### "Table already exists" Error

If tables already exist, the migrations will skip creating them (using `IF NOT EXISTS`).

### "Function already exists" Error

Functions are replaced with `CREATE OR REPLACE`, so this shouldn't be an issue.

## After Running Migrations

1. Test your connection:

   ```bash
   npm run test:supabase
   ```

2. Seed sample feed posts:

   ```bash
   npm run seed:feed
   ```

3. Start your app:
   ```bash
   npm start
   ```

## Environment Setup

Make sure you have a `.env` file with:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
