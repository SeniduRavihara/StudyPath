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
((SELECT id FROM public.subjects WHERE name = 'Mathematics' LIMIT 1), 'Calculus Fundamentals', 'Introduction to differentiation and integration', 8, 25, 'Advanced'),
((SELECT id FROM public.subjects WHERE name = 'Mathematics' LIMIT 1), 'Statistics & Probability', 'Data analysis and probability theory', 6, 20, 'Intermediate'),
((SELECT id FROM public.subjects WHERE name = 'Mathematics' LIMIT 1), 'Linear Algebra', 'Vectors, matrices, and linear transformations', 10, 30, 'Advanced'),
((SELECT id FROM public.subjects WHERE name = 'Physics' LIMIT 1), 'Mechanics', 'Newtonian mechanics and motion', 10, 30, 'Advanced'),
((SELECT id FROM public.subjects WHERE name = 'Physics' LIMIT 1), 'Electricity & Magnetism', 'Electrical circuits and magnetic fields', 8, 25, 'Intermediate'),
((SELECT id FROM public.subjects WHERE name = 'Physics' LIMIT 1), 'Thermodynamics', 'Heat, energy, and entropy', 6, 20, 'Advanced'),
((SELECT id FROM public.subjects WHERE name = 'Chemistry' LIMIT 1), 'Organic Chemistry', 'Carbon compounds and reactions', 12, 35, 'Advanced'),
((SELECT id FROM public.subjects WHERE name = 'Chemistry' LIMIT 1), 'Inorganic Chemistry', 'Non-carbon compounds and reactions', 8, 25, 'Intermediate'),
((SELECT id FROM public.subjects WHERE name = 'Biology' LIMIT 1), 'Cell Biology', 'Cell structure and function', 6, 20, 'Beginner'),
((SELECT id FROM public.subjects WHERE name = 'Biology' LIMIT 1), 'Genetics', 'Heredity and genetic variation', 8, 25, 'Intermediate'),
((SELECT id FROM public.subjects WHERE name = 'Biology' LIMIT 1), 'Human Physiology', 'Body systems and functions', 10, 30, 'Intermediate'),
((SELECT id FROM public.subjects WHERE name = 'English Literature' LIMIT 1), 'Shakespeare Analysis', 'Understanding Shakespearean works', 4, 15, 'Beginner'),
((SELECT id FROM public.subjects WHERE name = 'English Literature' LIMIT 1), 'Modern Poetry', 'Contemporary poetry analysis', 6, 20, 'Intermediate')
ON CONFLICT DO NOTHING;

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

-- Insert sample feed posts FIRST (before comments and MCQs)
INSERT INTO public.feed_posts (user_id, content, type, subject, achievement, points_earned, likes, comments, media_url, pack_data) VALUES
('00000000-0000-0000-0000-000000000001', 'Just completed Chapter 5 of Calculus! The integration techniques are finally clicking. Who else is working on this?', 'milestone', 'Mathematics', 'Chapter Master', 150, 24, 8, NULL, NULL),
('00000000-0000-0000-0000-000000000002', 'Physics lab simulation on wave interference was amazing! The virtual experiments really help understand the concepts.', 'achievement', 'Physics', 'Lab Expert', 200, 31, 12, 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop', NULL),
('00000000-0000-0000-0000-000000000003', 'Finally got my first 100% on a Chemistry quiz! Thanks to everyone who helped me with molecular structures 🎉', 'achievement', 'Chemistry', 'Perfect Score', 300, 45, 15, NULL, NULL),
('00000000-0000-0000-0000-000000000004', '📚 Pro Tip: Use the Pomodoro Technique (25 min study + 5 min break) to maximize your learning efficiency!', 'tip', 'Study Tips', 'Daily Tip', 0, 89, 23, NULL, NULL),
('00000000-0000-0000-0000-000000000005', 'Struggling with organic chemistry mechanisms. Any tips for remembering reaction pathways?', 'question', 'Chemistry', 'Seeking Help', 0, 12, 7, NULL, NULL),
('00000000-0000-0000-0000-000000000001', 'Linear algebra is getting intense! Eigenvalues and eigenvectors are mind-bending but fascinating.', 'milestone', 'Mathematics', 'Concept Master', 100, 18, 5, NULL, NULL),
('00000000-0000-0000-0000-000000000002', 'Just finished the thermodynamics chapter. The laws of physics never cease to amaze me!', 'achievement', 'Physics', 'Thermo Expert', 150, 22, 9, NULL, NULL),
('00000000-0000-0000-0000-000000000003', 'Cell biology is so interesting! Learning about mitochondria being the powerhouse of the cell 🔋', 'milestone', 'Biology', 'Cell Explorer', 80, 15, 4, NULL, NULL),
('00000000-0000-0000-0000-000000000005', 'Modern poetry analysis is challenging but rewarding. The symbolism in contemporary works is incredible!', 'achievement', 'English Literature', 'Poetry Analyst', 120, 28, 11, NULL, NULL),
('00000000-0000-0000-0000-000000000004', '💡 Study Hack: Create mind maps for complex topics. Visual connections help with retention!', 'tip', 'Study Tips', 'Visual Learning', 0, 67, 19, NULL, NULL),
-- Educational pack posts
('00000000-0000-0000-0000-000000000001', '📚 Calculus Quiz Pack: 25 questions covering differentiation, integration, and limits. Perfect for exam prep!', 'quiz_pack', 'Mathematics', 'Quiz Creator', 0, 45, 12, NULL, '{"subject": "Mathematics", "chapter": "Calculus Fundamentals", "question_count": 25, "difficulty": "Advanced", "topics": ["differentiation", "integration", "limits"]}'),
('00000000-0000-0000-0000-000000000002', '⚡ Physics Mechanics Pack: 30 questions on Newtonian mechanics, motion, and forces. Great for understanding core concepts!', 'quiz_pack', 'Physics', 'Physics Expert', 0, 38, 8, NULL, '{"subject": "Physics", "chapter": "Mechanics", "question_count": 30, "difficulty": "Advanced", "topics": ["newtonian_mechanics", "motion", "forces"]}'),
('00000000-0000-0000-0000-000000000003', '🧪 Organic Chemistry Pack: 20 questions on reaction mechanisms and molecular structures.', 'quiz_pack', 'Chemistry', 'Chemistry Master', 0, 52, 15, NULL, '{"subject": "Chemistry", "chapter": "Organic Chemistry", "question_count": 20, "difficulty": "Intermediate", "topics": ["reaction_mechanisms", "molecular_structures"]}')
ON CONFLICT DO NOTHING;

-- NOW insert sample comments for feed posts (AFTER feed posts exist)
INSERT INTO public.feed_comments (post_id, user_id, content) VALUES
((SELECT id FROM public.feed_posts WHERE content LIKE '%Calculus%' AND type = 'milestone' LIMIT 1), '00000000-0000-0000-0000-000000000002', 'Great job! Integration can be tricky at first.'),
((SELECT id FROM public.feed_posts WHERE content LIKE '%Calculus%' AND type = 'milestone' LIMIT 1), '00000000-0000-0000-0000-000000000003', 'I am still struggling with this chapter.'),
((SELECT id FROM public.feed_posts WHERE content LIKE '%Physics lab%' LIMIT 1), '00000000-0000-0000-0000-000000000001', 'Wave interference is fascinating!'),
((SELECT id FROM public.feed_posts WHERE content LIKE '%Chemistry quiz%' LIMIT 1), '00000000-0000-0000-0000-000000000004', 'Congratulations! 🎉'),
((SELECT id FROM public.feed_posts WHERE content LIKE '%Pomodoro%' LIMIT 1), '00000000-0000-0000-0000-000000000005', 'This technique really works!')
ON CONFLICT DO NOTHING;

-- NOW insert sample MCQs for educational content (AFTER feed posts exist)
INSERT INTO public.mcqs (subject_id, chapter_id, question, options, correct_answer, explanation, difficulty, is_imported, imported_from_post_id) VALUES
-- Built-in MCQs (not imported)
((SELECT id FROM public.subjects WHERE name = 'Mathematics' LIMIT 1), (SELECT id FROM public.chapters WHERE title = 'Calculus Fundamentals' LIMIT 1), 'What is the derivative of x²?', ARRAY['2x', 'x', '2', 'x²'], 0, 'The derivative of x² is 2x using the power rule.', 'easy', false, NULL),
((SELECT id FROM public.subjects WHERE name = 'Mathematics' LIMIT 1), (SELECT id FROM public.chapters WHERE title = 'Calculus Fundamentals' LIMIT 1), 'What is the integral of 2x?', ARRAY['x²', 'x² + C', '2x²', 'x² + 2'], 1, 'The integral of 2x is x² + C, where C is the constant of integration.', 'medium', false, NULL),
((SELECT id FROM public.subjects WHERE name = 'Physics' LIMIT 1), (SELECT id FROM public.chapters WHERE title = 'Mechanics' LIMIT 1), 'What is Newton''s first law?', ARRAY['F = ma', 'An object at rest stays at rest', 'For every action there is an equal reaction', 'Gravity pulls objects down'], 1, 'Newton''s first law states that an object at rest stays at rest unless acted upon by an external force.', 'easy', false, NULL),
-- Imported MCQs (from educational pack posts)
((SELECT id FROM public.subjects WHERE name = 'Mathematics' LIMIT 1), (SELECT id FROM public.chapters WHERE title = 'Calculus Fundamentals' LIMIT 1), 'What is the limit of (x²-1)/(x-1) as x approaches 1?', ARRAY['0', '1', '2', 'Undefined'], 2, 'Using L''Hôpital''s rule or factoring, the limit is 2.', 'hard', true, (SELECT id FROM public.feed_posts WHERE type = 'quiz_pack' AND subject = 'Mathematics' LIMIT 1)),
((SELECT id FROM public.subjects WHERE name = 'Mathematics' LIMIT 1), (SELECT id FROM public.chapters WHERE title = 'Calculus Fundamentals' LIMIT 1), 'What is the derivative of sin(x)?', ARRAY['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], 0, 'The derivative of sin(x) is cos(x).', 'medium', true, (SELECT id FROM public.feed_posts WHERE type = 'quiz_pack' AND subject = 'Mathematics' LIMIT 1)),
((SELECT id FROM public.subjects WHERE name = 'Physics' LIMIT 1), (SELECT id FROM public.chapters WHERE title = 'Mechanics' LIMIT 1), 'What is the formula for kinetic energy?', ARRAY['KE = mgh', 'KE = ½mv²', 'KE = mv', 'KE = Fd'], 1, 'Kinetic energy is given by KE = ½mv² where m is mass and v is velocity.', 'medium', true, (SELECT id FROM public.feed_posts WHERE type = 'quiz_pack' AND subject = 'Physics' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Update subject chapter counts
UPDATE public.subjects SET chapters = (
  SELECT COUNT(*) FROM public.chapters WHERE subject_id = subjects.id
);

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
