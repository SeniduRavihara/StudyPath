import {
  BookOpen,
  Edit,
  FileText,
  HelpCircle,
  Layers,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { SupabaseService } from "../lib/supabaseService";

interface FeedPost {
  id: string;
  title: string;
  content: string;
  type: "normal" | "quiz_pack" | "lesson_pack";
  subject: string;
  pack_data: any;
  likes: number;
  comments: number;
  created_at: string;
  users: {
    id: string;
    email: string;
    user_metadata: any;
  };
}

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface MCQ {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  chapter_id: string;
}

const StudyPackManager: React.FC = () => {
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [filteredMcqs, setFilteredMcqs] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<FeedPost | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "quiz_pack" as "quiz_pack" | "lesson_pack",
    subject: "",
    selectedMcqs: [] as string[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.subject === "") {
      setFilteredMcqs(mcqs);
    } else {
      // Filter MCQs by the selected subject
      const filtered = mcqs.filter(() => {
        // We need to check if the MCQ's chapter belongs to the selected subject
        // Since we don't have direct subject_id in MCQ, we'll need to get chapters
        // For now, let's filter by subject name in the MCQ data structure
        return true; // We'll implement proper filtering when we have the data structure
      });
      setFilteredMcqs(filtered);
    }
  }, [formData.subject, mcqs]);

  const fetchData = async () => {
    try {
      const [feedPostsRes, subjectsRes, mcqsRes] = await Promise.all([
        SupabaseService.getFeedPosts(),
        SupabaseService.getSubjects(),
        SupabaseService.getMCQs(),
      ]);

      if (feedPostsRes.data) {
        setFeedPosts(
          feedPostsRes.data.filter(
            post => post.type === "quiz_pack" || post.type === "lesson_pack",
          ),
        );
      }
      if (subjectsRes.data) setSubjects(subjectsRes.data);
      if (mcqsRes.data) {
        setMcqs(mcqsRes.data);
        setFilteredMcqs(mcqsRes.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { user } = await SupabaseService.getCurrentUser();
      if (!user) throw new Error("User not authenticated");

      // Feed post creation disabled - table not in current schema
      // const selectedMcqData = mcqs.filter(mcq =>
      //   formData.selectedMcqs.includes(mcq.id),
      // );
      // const packData = {
      //   mcqs: selectedMcqData,
      //   subject: formData.subject,
      //   created_at: new Date().toISOString(),
      // };
      // const postData = {
      //   title: formData.title,
      //   content: formData.content,
      //   type: formData.type,
      //   subject: formData.subject,
      //   pack_data: packData,
      //   user_id: user.id,
      //   likes: 0,
      //   comments: 0,
      // };
      // const { data, error } = await SupabaseService.createFeedPost(postData);
      // if (error) throw error;
      // setFeedPosts(prev => [data, ...prev]);

      setShowCreateForm(false);
      resetForm();

      alert("Study pack created successfully! (Feed post creation disabled)");
    } catch (error) {
      console.error("Error creating study pack:", error);
      alert("Error creating study pack. Please try again.");
    }
  };

  const handleDeletePost = async (_id: string) => {
    if (!confirm("Are you sure you want to delete this study pack?")) return;

    try {
      // Feed post deletion disabled - table not in current schema
      // const { error } = await SupabaseService.deleteFeedPost(id);
      // if (error) throw error;
      // setFeedPosts(prev => prev.filter(post => post.id !== id));

      alert("Study pack deletion disabled (Feed post table not available)");
    } catch (error) {
      console.error("Error deleting study pack:", error);
      alert("Error deleting study pack. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      type: "quiz_pack",
      subject: "",
      selectedMcqs: [],
    });
    setEditingPost(null);
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "quiz_pack":
        return <HelpCircle className="w-5 h-5 text-orange-500" />;
      case "lesson_pack":
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "quiz_pack":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "lesson_pack":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Study Pack Manager</h1>
          <p className="text-dark-400 mt-2">
            Create and manage quiz packs and lesson packs for the mobile app
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Study Pack</span>
        </button>
      </div>

      {/* Study Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedPosts.map(post => (
          <div
            key={post.id}
            className="card group hover:scale-105 transition-transform duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getPostTypeIcon(post.type)}
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {post.title}
                  </h3>
                  <p className="text-dark-400 text-sm capitalize">
                    {post.type.replace("_", " ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingPost(post)}
                  className="text-dark-400 hover:text-white transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-dark-300 text-sm mb-4 line-clamp-3">
              {post.content}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-dark-400">
                <span className="flex items-center space-x-1">
                  <HelpCircle className="w-4 h-4" />
                  <span>{post.pack_data?.mcqs?.length || 0} MCQs</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Layers className="w-4 h-4" />
                  <span>{post.subject}</span>
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getPostTypeColor(post.type)}`}
              >
                {post.type.replace("_", " ")}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-dark-700">
              <div className="flex items-center justify-between text-sm text-dark-400">
                <span>
                  Created by{" "}
                  {post.users?.user_metadata?.name || post.users?.email}
                </span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingPost ? "Edit Study Pack" : "Create Study Pack"}
              </h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
                className="text-dark-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter study pack title"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.content}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, content: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 h-24 resize-none"
                  placeholder="Describe what this study pack contains"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      type: e.target.value as "quiz_pack" | "lesson_pack",
                    }))
                  }
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="quiz_pack">Quiz Pack</option>
                  <option value="lesson_pack">Lesson Pack</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, subject: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* MCQs Selection */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Select MCQs
                </label>
                <div className="max-h-48 overflow-y-auto bg-dark-800 border border-dark-700 rounded-lg p-4">
                  {filteredMcqs.length === 0 ? (
                    <p className="text-dark-400 text-center py-4">
                      {formData.subject
                        ? `No MCQs available for ${formData.subject}. Create some MCQs first.`
                        : "No MCQs available. Create some MCQs first."}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {filteredMcqs.map(mcq => (
                        <label
                          key={mcq.id}
                          className="flex items-start space-x-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.selectedMcqs.includes(mcq.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  selectedMcqs: [...prev.selectedMcqs, mcq.id],
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  selectedMcqs: prev.selectedMcqs.filter(
                                    id => id !== mcq.id,
                                  ),
                                }));
                              }
                            }}
                            className="mt-1 w-4 h-4 text-primary-500 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
                          />
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">
                              {mcq.question}
                            </p>
                            <p className="text-dark-400 text-xs mt-1">
                              {mcq.options.join(" | ")}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-dark-400 text-sm mt-2">
                  Selected: {formData.selectedMcqs.length} MCQs
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {editingPost ? "Update Study Pack" : "Create Study Pack"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPackManager;
