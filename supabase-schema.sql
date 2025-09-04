-- StudyPath App Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Beginner',
    points INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    rank TEXT DEFAULT 'Novice',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT[] DEFAULT ARRAY['#00d4ff', '#0099cc'],
    difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Beginner',
    chapters INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chapters table
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    lessons INTEGER DEFAULT 0,
    points INTEGER DEFAULT 10,
    difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Beginner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    points_earned INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, chapter_id)
);

-- Feed Posts table
CREATE TABLE IF NOT EXISTS public.feed_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type TEXT CHECK (type IN ('achievement', 'question', 'milestone', 'tip')) NOT NULL,
    subject TEXT,
    achievement TEXT,
    points_earned INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    media_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Subjects policies (public read, admin write)
CREATE POLICY "Anyone can view subjects" ON public.subjects
    FOR SELECT USING (true);

-- Chapters policies (public read, admin write)
CREATE POLICY "Anyone can view chapters" ON public.chapters
    FOR SELECT USING (true);

-- User Progress policies
CREATE POLICY "Users can view their own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Feed Posts policies
CREATE POLICY "Anyone can view feed posts" ON public.feed_posts
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own posts" ON public.feed_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.feed_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.feed_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Functions
-- Function to update user points and rank
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user points
    UPDATE public.users 
    SET points = points + NEW.points_earned,
        updated_at = NOW()
    WHERE id = NEW.user_id;
    
    -- Update user rank based on points
    UPDATE public.users 
    SET rank = CASE 
        WHEN points >= 1000 THEN 'Master'
        WHEN points >= 500 THEN 'Expert'
        WHEN points >= 200 THEN 'Advanced'
        WHEN points >= 100 THEN 'Intermediate'
        WHEN points >= 50 THEN 'Apprentice'
        ELSE 'Novice'
    END
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user progress updates
CREATE TRIGGER trigger_update_user_stats
    AFTER INSERT OR UPDATE ON public.user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats();

-- Function to update subject chapter count
CREATE OR REPLACE FUNCTION update_subject_chapter_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.subjects 
        SET chapters = chapters + 1 
        WHERE id = NEW.subject_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.subjects 
        SET chapters = chapters - 1 
        WHERE id = OLD.subject_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for subject chapter count updates
CREATE TRIGGER trigger_update_subject_chapter_count
    AFTER INSERT OR DELETE ON public.chapters
    FOR EACH ROW
    EXECUTE FUNCTION update_subject_chapter_count();

-- Insert sample data
INSERT INTO public.subjects (name, description, icon, color, difficulty, chapters) VALUES
('Mathematics', 'Advanced Level Mathematics including Calculus, Statistics, and Algebra', '📐', ARRAY['#ff6b6b', '#ee5a24'], 'Advanced', 0),
('Physics', 'Physics concepts including Mechanics, Electricity, and Modern Physics', '⚡', ARRAY['#4ecdc4', '#44a08d'], 'Advanced', 0),
('Chemistry', 'Organic and Inorganic Chemistry with practical applications', '🧪', ARRAY['#45b7d1', '#96ceb4'], 'Intermediate', 0),
('Biology', 'Cell Biology, Genetics, and Human Physiology', '🧬', ARRAY['#96ceb4', '#feca57'], 'Intermediate', 0),
('English Literature', 'Classic and Modern Literature Analysis', '📚', ARRAY['#ff9ff3', '#54a0ff'], 'Beginner', 0)
ON CONFLICT (name) DO NOTHING;

-- Insert sample chapters
INSERT INTO public.chapters (subject_id, title, description, lessons, points, difficulty) VALUES
((SELECT id FROM public.subjects WHERE name = 'Mathematics'), 'Calculus Fundamentals', 'Introduction to differentiation and integration', 8, 25, 'Advanced'),
((SELECT id FROM public.subjects WHERE name = 'Mathematics'), 'Statistics & Probability', 'Data analysis and probability theory', 6, 20, 'Intermediate'),
((SELECT id FROM public.subjects WHERE name = 'Physics'), 'Mechanics', 'Newtonian mechanics and motion', 10, 30, 'Advanced'),
((SELECT id FROM public.subjects WHERE name = 'Physics'), 'Electricity & Magnetism', 'Electrical circuits and magnetic fields', 8, 25, 'Intermediate'),
((SELECT id FROM public.subjects WHERE name = 'Chemistry'), 'Organic Chemistry', 'Carbon compounds and reactions', 12, 35, 'Advanced'),
((SELECT id FROM public.subjects WHERE name = 'Biology'), 'Cell Biology', 'Cell structure and function', 6, 20, 'Beginner'),
((SELECT id FROM public.subjects WHERE name = 'English Literature'), 'Shakespeare Analysis', 'Understanding Shakespearean works', 4, 15, 'Beginner')
ON CONFLICT DO NOTHING;
