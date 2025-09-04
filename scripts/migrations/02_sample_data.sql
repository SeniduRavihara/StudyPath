-- Sample Data for All Tables
-- Run this after the schema

-- Insert sample subjects
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
((SELECT id FROM public.subjects WHERE name = 'Mathematics'), 'Linear Algebra', 'Vectors, matrices, and linear transformations', 10, 30, 'Advanced'),
((SELECT id FROM public.subjects WHERE name = 'Physics'), 'Mechanics', 'Newtonian mechanics and motion', 10, 30, 'Advanced'),
((SELECT id FROM public.subjects WHERE name = 'Physics'), 'Electricity & Magnetism', 'Electrical circuits and magnetic fields', 8, 25, 'Intermediate'),
((SELECT id FROM public.subjects WHERE name = 'Physics'), 'Thermodynamics', 'Heat, energy, and entropy', 6, 20, 'Advanced'),
((SELECT id FROM public.subjects WHERE name = 'Chemistry'), 'Organic Chemistry', 'Carbon compounds and reactions', 12, 35, 'Advanced'),
((SELECT id FROM public.subjects WHERE name = 'Chemistry'), 'Inorganic Chemistry', 'Non-carbon compounds and reactions', 8, 25, 'Intermediate'),
((SELECT id FROM public.subjects WHERE name = 'Biology'), 'Cell Biology', 'Cell structure and function', 6, 20, 'Beginner'),
((SELECT id FROM public.subjects WHERE name = 'Biology'), 'Genetics', 'Heredity and genetic variation', 8, 25, 'Intermediate'),
((SELECT id FROM public.subjects WHERE name = 'Biology'), 'Human Physiology', 'Body systems and functions', 10, 30, 'Intermediate'),
((SELECT id FROM public.subjects WHERE name = 'English Literature'), 'Shakespeare Analysis', 'Understanding Shakespearean works', 4, 15, 'Beginner'),
((SELECT id FROM public.subjects WHERE name = 'English Literature'), 'Modern Poetry', 'Contemporary poetry analysis', 6, 20, 'Intermediate')
ON CONFLICT DO NOTHING;

-- Update subject chapter counts
UPDATE public.subjects SET chapters = (
  SELECT COUNT(*) FROM public.chapters WHERE subject_id = subjects.id
);

-- Insert sample users (temporarily disable foreign key constraint)
-- We'll create fake users for demo purposes
SET session_replication_role = replica;

INSERT INTO public.users (id, email, name, level, points, streak, rank) VALUES
('00000000-0000-0000-0000-000000000001', 'test1@example.com', 'Sarah Johnson', 'Advanced', 3420, 7, 'Diamond'),
('00000000-0000-0000-0000-000000000002', 'test2@example.com', 'Michael Chen', 'Intermediate', 2100, 3, 'Gold'),
('00000000-0000-0000-0000-000000000003', 'test3@example.com', 'Emma Wilson', 'Beginner', 890, 5, 'Silver'),
('00000000-0000-0000-0000-000000000004', 'test4@example.com', 'Study Tips Bot', 'Advanced', 9999, 365, 'Legend'),
('00000000-0000-0000-0000-000000000005', 'test5@example.com', 'Alex Rodriguez', 'Intermediate', 1500, 12, 'Gold')
ON CONFLICT (id) DO NOTHING;

-- Re-enable foreign key constraints
SET session_replication_role = DEFAULT;

-- Insert sample user progress
INSERT INTO public.user_progress (user_id, chapter_id, completed, points_earned, completed_at) VALUES
-- Sarah's progress (Advanced user)
('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.chapters WHERE title = 'Calculus Fundamentals' LIMIT 1), true, 25, NOW() - INTERVAL '2 days'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.chapters WHERE title = 'Statistics & Probability' LIMIT 1), true, 20, NOW() - INTERVAL '5 days'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.chapters WHERE title = 'Mechanics' LIMIT 1), true, 30, NOW() - INTERVAL '1 week'),
-- Michael's progress (Intermediate user)
('00000000-0000-0000-0000-000000000002', (SELECT id FROM public.chapters WHERE title = 'Statistics & Probability' LIMIT 1), true, 20, NOW() - INTERVAL '3 days'),
('00000000-0000-0000-0000-000000000002', (SELECT id FROM public.chapters WHERE title = 'Electricity & Magnetism' LIMIT 1), true, 25, NOW() - INTERVAL '1 week'),
('00000000-0000-0000-0000-000000000002', (SELECT id FROM public.chapters WHERE title = 'Inorganic Chemistry' LIMIT 1), false, 0, NULL),
-- Emma's progress (Beginner user)
('00000000-0000-0000-0000-000000000003', (SELECT id FROM public.chapters WHERE title = 'Cell Biology' LIMIT 1), true, 20, NOW() - INTERVAL '1 day'),
('00000000-0000-0000-0000-000000000003', (SELECT id FROM public.chapters WHERE title = 'Shakespeare Analysis' LIMIT 1), false, 0, NULL),
-- Alex's progress
('00000000-0000-0000-0000-000000000005', (SELECT id FROM public.chapters WHERE title = 'Genetics' LIMIT 1), true, 25, NOW() - INTERVAL '4 days'),
('00000000-0000-0000-0000-000000000005', (SELECT id FROM public.chapters WHERE title = 'Modern Poetry' LIMIT 1), true, 20, NOW() - INTERVAL '2 days')
ON CONFLICT (user_id, chapter_id) DO NOTHING;

-- Insert sample feed posts
INSERT INTO public.feed_posts (user_id, content, type, subject, achievement, points_earned, likes, comments, media_url) VALUES
('00000000-0000-0000-0000-000000000001', 'Just completed Chapter 5 of Calculus! The integration techniques are finally clicking. Who else is working on this?', 'milestone', 'Mathematics', 'Chapter Master', 150, 24, 8, NULL),
('00000000-0000-0000-0000-000000000002', 'Physics lab simulation on wave interference was amazing! The virtual experiments really help understand the concepts.', 'achievement', 'Physics', 'Lab Expert', 200, 31, 12, 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop'),
('00000000-0000-0000-0000-000000000003', 'Finally got my first 100% on a Chemistry quiz! Thanks to everyone who helped me with molecular structures 🎉', 'achievement', 'Chemistry', 'Perfect Score', 300, 45, 15, NULL),
('00000000-0000-0000-0000-000000000004', '📚 Pro Tip: Use the Pomodoro Technique (25 min study + 5 min break) to maximize your learning efficiency!', 'tip', 'Study Tips', 'Daily Tip', 0, 89, 23, NULL),
('00000000-0000-0000-0000-000000000005', 'Struggling with organic chemistry mechanisms. Any tips for remembering reaction pathways?', 'question', 'Chemistry', 'Seeking Help', 0, 12, 7, NULL),
('00000000-0000-0000-0000-000000000001', 'Linear algebra is getting intense! Eigenvalues and eigenvectors are mind-bending but fascinating.', 'milestone', 'Mathematics', 'Concept Master', 100, 18, 5, NULL),
('00000000-0000-0000-0000-000000000002', 'Just finished the thermodynamics chapter. The laws of physics never cease to amaze me!', 'achievement', 'Physics', 'Thermo Expert', 150, 22, 9, NULL),
('00000000-0000-0000-0000-000000000003', 'Cell biology is so interesting! Learning about mitochondria being the powerhouse of the cell 🔋', 'milestone', 'Biology', 'Cell Explorer', 80, 15, 4, NULL),
('00000000-0000-0000-0000-000000000005', 'Modern poetry analysis is challenging but rewarding. The symbolism in contemporary works is incredible!', 'achievement', 'English Literature', 'Poetry Analyst', 120, 28, 11, NULL),
('00000000-0000-0000-0000-000000000004', '💡 Study Hack: Create mind maps for complex topics. Visual connections help with retention!', 'tip', 'Study Tips', 'Visual Learning', 0, 67, 19, NULL)
ON CONFLICT DO NOTHING;
