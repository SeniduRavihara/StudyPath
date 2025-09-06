-- User Subscriptions Migration
-- This adds the ability for users to subscribe to subjects

-- User Subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, subject_id)
);

-- Add some sample subjects if they don't exist
INSERT INTO public.subjects (name, description, icon, color, difficulty, chapters) VALUES
('Mathematics', 'Advanced mathematics including calculus, algebra, and geometry', 'calculator', ARRAY['#667eea', '#764ba2'], 'Advanced', 12),
('Physics', 'Classical and modern physics concepts', 'planet', ARRAY['#f093fb', '#f5576c'], 'Intermediate', 15),
('Chemistry', 'Organic and inorganic chemistry fundamentals', 'flask', ARRAY['#4facfe', '#00f2fe'], 'Advanced', 14),
('Biology', 'Life sciences and biological processes', 'leaf', ARRAY['#43e97b', '#38f9d7'], 'Beginner', 16),
('Computer Science', 'Programming, algorithms, and computer fundamentals', 'code-slash', ARRAY['#ff6b6b', '#ee5a24'], 'Intermediate', 10),
('History', 'World history and historical events', 'book', ARRAY['#a8e6cf', '#88d8a3'], 'Beginner', 8),
('Geography', 'Physical and human geography', 'globe', ARRAY['#ffd93d', '#6bcf7f'], 'Beginner', 9),
('Literature', 'Classic and modern literature analysis', 'library', ARRAY['#c44569', '#f8b500'], 'Intermediate', 11),
('Economics', 'Micro and macro economics principles', 'trending-up', ARRAY['#00d2d3', '#54a0ff'], 'Advanced', 7),
('Psychology', 'Human behavior and mental processes', 'people', ARRAY['#ff9ff3', '#f368e0'], 'Intermediate', 13)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_subject_id ON public.user_subscriptions(subject_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_active ON public.user_subscriptions(is_active);

-- Grant permissions
GRANT ALL ON public.user_subscriptions TO authenticated;
GRANT ALL ON public.subjects TO authenticated;
