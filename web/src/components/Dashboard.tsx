import {
  Activity,
  BookOpen,
  FileText,
  HelpCircle,
  Layers,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { SupabaseService } from "../lib/supabaseService";

interface Stats {
  subjects: number;
  chapters: number;
  lessons: number;
  mcqs: number;
  feedPosts: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    subjects: 0,
    chapters: 0,
    lessons: 0,
    mcqs: 0,
    feedPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await SupabaseService.getStats();
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      name: "Total Subjects",
      value: stats.subjects,
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
    },
    {
      name: "Total Chapters",
      value: stats.chapters,
      icon: Layers,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
    },
    {
      name: "Total Lessons",
      value: stats.lessons,
      icon: FileText,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
    },
    {
      name: "Total MCQs",
      value: stats.mcqs,
      icon: HelpCircle,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-500",
    },
    {
      name: "Study Packs",
      value: stats.feedPosts,
      icon: Package,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
    },
  ];

  const recentActivities = [
    { action: "New MCQ added", subject: "Physics", time: "2 hours ago" },
    { action: "Chapter updated", subject: "Chemistry", time: "4 hours ago" },
    { action: "New lesson created", subject: "Mathematics", time: "1 day ago" },
    { action: "Subject created", subject: "Biology", time: "2 days ago" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="gradient-bg rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to StudyPath Admin</h1>
        <p className="text-white/80 text-lg">
          Manage your learning platform, create content, and track student
          progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="card group hover:scale-105 transition-transform duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm font-medium">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left flex items-center space-x-3">
              <BookOpen className="w-5 h-5" />
              <span>Create New Subject</span>
            </button>
            <button className="w-full btn-secondary text-left flex items-center space-x-3">
              <Layers className="w-5 h-5" />
              <span>Add New Chapter</span>
            </button>
            <button className="w-full btn-secondary text-left flex items-center space-x-3">
              <FileText className="w-5 h-5" />
              <span>Create New Lesson</span>
            </button>
            <button className="w-full btn-secondary text-left flex items-center space-x-3">
              <HelpCircle className="w-5 h-5" />
              <span>Add New MCQ</span>
            </button>
            <button className="w-full btn-secondary text-left flex items-center space-x-3">
              <Package className="w-5 h-5" />
              <span>Create Study Pack</span>
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {activity.action}
                    </p>
                    <p className="text-dark-400 text-xs">{activity.subject}</p>
                  </div>
                </div>
                <span className="text-dark-400 text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            Performance Overview
          </h3>
          <div className="flex items-center space-x-2 text-sm text-dark-400">
            <Activity className="w-4 h-4" />
            <span>Last 30 days</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-dark-700 rounded-lg">
            <div className="w-16 h-16 mx-auto mb-3 bg-green-500/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-white">+12%</p>
            <p className="text-dark-400 text-sm">Content Growth</p>
          </div>

          <div className="text-center p-4 bg-dark-700 rounded-lg">
            <div className="w-16 h-16 mx-auto mb-3 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-white">+8%</p>
            <p className="text-dark-400 text-sm">Student Engagement</p>
          </div>

          <div className="text-center p-4 bg-dark-700 rounded-lg">
            <div className="w-16 h-16 mx-auto mb-3 bg-purple-500/20 rounded-full flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-white">+15%</p>
            <p className="text-dark-400 text-sm">Quiz Completion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
