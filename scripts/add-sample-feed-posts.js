const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample feed posts data (without specific user IDs)
const samplePosts = [
  {
    content:
      "Just completed Chapter 5 of Calculus! The integration techniques are finally clicking. Who else is working on this?",
    type: "milestone",
    subject: "Mathematics",
    achievement: "Chapter Master",
    points_earned: 150,
    likes: 24,
    comments: 8,
    media_url: null,
  },
  {
    content:
      "Physics lab simulation on wave interference was amazing! The virtual experiments really help understand the concepts.",
    type: "achievement",
    subject: "Physics",
    achievement: "Lab Expert",
    points_earned: 200,
    likes: 31,
    comments: 12,
    media_url:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop",
  },
  {
    content:
      "Finally got my first 100% on a Chemistry quiz! Thanks to everyone who helped me with molecular structures 🎉",
    type: "achievement",
    subject: "Chemistry",
    achievement: "Perfect Score",
    points_earned: 300,
    likes: 45,
    comments: 15,
    media_url: null,
  },
  {
    content:
      "📚 Pro Tip: Use the Pomodoro Technique (25 min study + 5 min break) to maximize your learning efficiency!",
    type: "tip",
    subject: "Study Tips",
    achievement: "Daily Tip",
    points_earned: 0,
    likes: 89,
    comments: 23,
    media_url: null,
  },
  {
    content:
      "Struggling with organic chemistry mechanisms. Any tips for remembering reaction pathways?",
    type: "question",
    subject: "Chemistry",
    achievement: "Seeking Help",
    points_earned: 0,
    likes: 12,
    comments: 7,
    media_url: null,
  },
];

async function addSampleFeedPosts() {
  try {
    console.log("🔄 Adding sample feed posts...");

    // First, let's check if we have any users in the database
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, name")
      .limit(5);

    if (usersError) {
      console.error("❌ Error fetching users:", usersError);
      return;
    }

    if (!users || users.length === 0) {
      console.log("⚠️  No users found in database.");
      console.log(
        "💡 Please sign up/login to create users first, then run this script again.",
      );
      return;
    }

    console.log(`✅ Found ${users.length} users in database`);

    // Create posts with real user IDs
    const postsWithRealUsers = samplePosts.map((post, index) => ({
      ...post,
      user_id: users[index % users.length].id,
    }));

    // Insert the posts
    const { data, error } = await supabase
      .from("feed_posts")
      .insert(postsWithRealUsers)
      .select();

    if (error) {
      console.error("❌ Error inserting feed posts:", error);
      return;
    }

    console.log(`✅ Successfully added ${data.length} sample feed posts!`);
    console.log("Sample posts created:");
    data.forEach((post, index) => {
      console.log(`${index + 1}. ${post.content.substring(0, 50)}...`);
    });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

// Run the function
addSampleFeedPosts();
