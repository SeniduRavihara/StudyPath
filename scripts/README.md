# Scripts Directory

This directory contains various utility scripts for the StudyPath app, including database migrations, seeding, and testing.

## 📁 Directory Structure

```
scripts/
├── README.md                           # This file
├── migrations/                         # Database migration files
│   ├── README.md                      # Migration-specific instructions
│   ├── 01_initial_schema.sql          # Create all tables
│   ├── 02_row_level_security.sql      # Enable RLS
│   ├── 03_users_policies.sql          # User table policies
│   ├── 04_subjects_chapters_policies.sql # Subjects/chapters policies
│   ├── 05_user_progress_policies.sql  # User progress policies
│   ├── 06_feed_posts_policies.sql     # Feed posts policies
│   ├── 07_functions_and_triggers.sql  # Database functions
│   └── 08_sample_data.sql             # Sample data
├── run-migrations.js                   # Migration runner
├── test-supabase-connection.js         # Test Supabase connection
├── seed-feed-posts.js                  # Seed sample feed posts
├── test-database.js                    # Test local database
├── test-drizzle-orm.js                 # Test Drizzle ORM
└── inspect-database.js                 # Inspect database structure
```

## 🚀 Quick Start

### 1. Set Up Environment Variables

Create a `.env` file in your project root:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Run Database Migrations

```bash
# Get manual migration instructions
npm run migrate:manual

# Or try automated migration (may not work)
npm run migrate
```

### 3. Test Your Setup

```bash
# Test Supabase connection
npm run test:supabase

# Seed sample feed posts
npm run seed:feed
```

## 📋 Available Scripts

### Database Migrations

| Script                  | Command                  | Description                             |
| ----------------------- | ------------------------ | --------------------------------------- |
| **Migration Runner**    | `npm run migrate`        | Run all migrations automatically        |
| **Manual Instructions** | `npm run migrate:manual` | Get step-by-step migration instructions |

**Migration Files (run in order):**

1. `01_initial_schema.sql` - Creates all database tables
2. `02_row_level_security.sql` - Enables Row Level Security
3. `03_users_policies.sql` - User table access policies
4. `04_subjects_chapters_policies.sql` - Subjects/chapters policies
5. `05_user_progress_policies.sql` - User progress policies
6. `06_feed_posts_policies.sql` - Feed posts policies
7. `07_functions_and_triggers.sql` - Database functions and triggers
8. `08_sample_data.sql` - Sample subjects and chapters

### Testing Scripts

| Script                  | Command                            | Description                             |
| ----------------------- | ---------------------------------- | --------------------------------------- |
| **Supabase Connection** | `npm run test:supabase`            | Test Supabase database connection       |
| **Drizzle ORM**         | `npm run test:drizzle`             | Test local SQLite database with Drizzle |
| **Database Structure**  | `node scripts/inspect-database.js` | Inspect local database structure        |

### Data Seeding

| Script         | Command             | Description                       |
| -------------- | ------------------- | --------------------------------- |
| **Feed Posts** | `npm run seed:feed` | Add sample feed posts to Supabase |

## 🔧 Detailed Script Descriptions

### Migration Scripts

#### `run-migrations.js`

- **Purpose**: Automatically run all database migrations
- **Usage**: `npm run migrate` or `npm run migrate:manual`
- **Features**:
  - Runs migrations in correct order
  - Handles "already exists" errors
  - Provides detailed feedback
  - Falls back to manual instructions

#### Migration Files

Each migration file is designed to be run sequentially in Supabase SQL Editor:

- **Safe to re-run**: Uses `IF NOT EXISTS` and `CREATE OR REPLACE`
- **Handles conflicts**: Drops existing policies before creating new ones
- **Atomic operations**: Each file is self-contained

### Testing Scripts

#### `test-supabase-connection.js`

- **Purpose**: Verify Supabase setup and connection
- **Checks**:
  - Environment variables are set
  - Database connection works
  - Tables exist and are accessible
  - Feed posts table has correct structure
  - Current data count

#### `test-drizzle-orm.js`

- **Purpose**: Test local SQLite database with Drizzle ORM
- **Features**:
  - Creates test database
  - Tests CRUD operations
  - Validates schema

#### `inspect-database.js`

- **Purpose**: Inspect local database structure
- **Shows**:
  - Table schemas
  - Data counts
  - Relationships

### Seeding Scripts

#### `seed-feed-posts.js`

- **Purpose**: Add sample feed posts to Supabase
- **Features**:
  - Creates realistic sample posts
  - Uses existing users from database
  - Handles different post types (achievement, milestone, tip, question)
  - Includes media URLs for some posts

## 🛠️ Manual Migration Process

If automated migration fails, follow these steps:

### Step 1: Access Supabase SQL Editor

1. Go to [supabase.com](https://supabase.com)
2. Navigate to your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run Migrations Sequentially

For each migration file:

1. Open the file from `scripts/migrations/`
2. Copy the entire content
3. Paste into Supabase SQL Editor
4. Click **Run**
5. Verify success (should show "Success" message)

### Step 3: Verify Setup

```bash
npm run test:supabase
```

## 🐛 Troubleshooting

### Common Issues

#### "Policy already exists" Error

- **Cause**: Running migrations multiple times
- **Solution**: The migration files handle this automatically with `DROP POLICY IF EXISTS`

#### "Table already exists" Error

- **Cause**: Tables already created
- **Solution**: Migration files use `IF NOT EXISTS` to handle this

#### "Missing environment variables" Error

- **Cause**: `.env` file not created or variables not set
- **Solution**: Create `.env` file with Supabase credentials

#### "Connection failed" Error

- **Cause**: Wrong Supabase URL or key
- **Solution**: Verify credentials in Supabase dashboard

### Environment Variables

Make sure your `.env` file contains:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**To get these values:**

1. Go to Supabase Dashboard → Settings → API
2. Copy "Project URL" and "anon public" key

## 📊 Database Schema Overview

After running migrations, your database will have:

### Tables

- **users** - User profiles and stats
- **subjects** - Study subjects (Math, Physics, etc.)
- **chapters** - Chapters within subjects
- **user_progress** - User's progress through chapters
- **feed_posts** - Social feed posts with media support

### Features

- **Row Level Security** - Proper access control
- **Real-time subscriptions** - Live updates for feed
- **Auto-updating stats** - Points and ranks update automatically
- **Media support** - Posts can include images

## 🔄 Workflow

### Initial Setup

1. Create Supabase project
2. Set up environment variables
3. Run migrations: `npm run migrate:manual`
4. Test connection: `npm run test:supabase`
5. Seed data: `npm run seed:feed`

### Development

- Use `npm run test:supabase` to verify connection
- Use `npm run seed:feed` to add more sample data
- Check `scripts/migrations/README.md` for detailed migration info

### Production

- Ensure all migrations are run
- Verify RLS policies are in place
- Test with real user data

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

## 🤝 Contributing

When adding new scripts:

1. Follow the naming convention: `purpose-description.js`
2. Add proper error handling
3. Include usage instructions in this README
4. Test with both success and failure scenarios
5. Update the package.json scripts section
