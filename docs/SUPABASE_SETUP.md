# 🚀 Supabase Setup Guide for StudyPath App

## 📋 **Prerequisites**

- Supabase account (free at [supabase.com](https://supabase.com))
- StudyPath app project ready

## 🔧 **Step 1: Create Supabase Project**

### 1.1 Sign Up & Create Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (recommended)
4. Create new organization (free)
5. Click "New Project"
6. Fill in details:
   - **Name**: `studypath-app`
   - **Database Password**: Create strong password (save this!)
   - **Region**: Choose closest to your users
7. Click "Create new project"

### 1.2 Get Project Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **Anon Public Key** (starts with `eyJ...`)

## 📱 **Step 2: Configure Your App**

### 2.1 Create Environment File

1. Copy `env.example` to `.env` in your project root
2. Fill in your Supabase credentials:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2.2 Install Dependencies

```bash
npm install @supabase/supabase-js
```

## 🗄️ **Step 3: Set Up Database**

### 3.1 Run SQL Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL
4. This creates:
   - Users table (extends auth)
   - Subjects table
   - Chapters table
   - User Progress table
   - Feed Posts table
   - Row Level Security policies
   - Triggers and functions
   - Sample data

### 3.2 Verify Tables

Go to **Table Editor** to see your new tables:

- ✅ `users`
- ✅ `subjects`
- ✅ `chapters`
- ✅ `user_progress`
- ✅ `feed_posts`

## 🔐 **Step 4: Configure Authentication**

### 4.1 Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. Configure settings as needed

### 4.2 Set Up Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize welcome, confirmation, and reset emails

## 🚀 **Step 5: Test Your Setup**

### 5.1 Test Connection

Your app should now connect to Supabase! The service files are ready to use:

```typescript
import { SupabaseService } from "./src/lib/supabaseService";

// Test sign up
const { data, error } = await SupabaseService.signUp(
  "test@example.com",
  "password123",
  "Test User"
);

// Test getting subjects
const { data: subjects, error } = await SupabaseService.getSubjects();
```

### 5.2 Check Real-time Features

- Feed posts update in real-time
- User progress syncs across devices
- Live notifications for achievements

## 📊 **Step 6: Monitor & Manage**

### 6.1 Dashboard Overview

- **Analytics**: User engagement, popular subjects
- **Database**: Monitor queries, performance
- **Logs**: Authentication, API calls

### 6.2 User Management

- View all users in **Authentication** → **Users**
- Manage user profiles in **Table Editor** → `users`

## 🔒 **Security Features**

### Row Level Security (RLS)

- Users can only see their own data
- Public read access for subjects/chapters
- Secure user progress tracking

### Authentication

- JWT-based auth with Supabase
- Secure password handling
- Email verification

## 💰 **Pricing & Limits (FREE Tier)**

### What's Included:

- **Database**: 500MB
- **Auth**: 50,000 users
- **Storage**: 1GB
- **Edge Functions**: 500,000 invocations/month
- **Real-time**: 2 concurrent connections

### When to Upgrade:

- Database > 500MB
- Users > 50,000
- Need more storage
- Higher real-time connections

## 🐳 **Self-Hosting Option**

### When Ready to Self-Host:

1. Export your data from Supabase Cloud
2. Set up Docker with Supabase
3. Migrate schema and data
4. Update environment variables

### Benefits:

- Full control over data
- No usage limits
- Custom configurations
- Cost-effective at scale

## 🆘 **Troubleshooting**

### Common Issues:

1. **Connection Error**: Check URL and API key
2. **Auth Issues**: Verify email provider settings
3. **RLS Errors**: Check policy configurations
4. **Real-time Not Working**: Verify subscription setup

### Get Help:

- [Supabase Docs](https://supabase.com/docs)
- [Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase)

## 🎯 **Next Steps**

1. **Test Authentication**: Sign up/sign in flows
2. **Populate Data**: Add more subjects and chapters
3. **Build Admin Panel**: For teachers to manage content
4. **Analytics**: Track student progress and engagement
5. **Mobile Push**: Add notifications for achievements

---

**🎉 Congratulations!** Your StudyPath app is now powered by Supabase with a robust backend, real-time features, and scalable architecture.
