import { Edit, Plus, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { SupabaseService } from "../lib/supabaseService";

interface Subject {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string[];
  difficulty: string;
  chapters: number;
  created_at: string;
}

const SubjectManager: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "📚",
    color: ["#00d4ff", "#0099cc"],
    difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
  });

  const colorPresets = [
    ["#ff6b6b", "#ee5a24"], // Red
    ["#4ecdc4", "#44a08d"], // Teal
    ["#45b7d1", "#96ceb4"], // Blue
    ["#96ceb4", "#feca57"], // Green
    ["#ff9ff3", "#54a0ff"], // Pink
    ["#a8e6cf", "#ffd3a5"], // Light Green
    ["#ffaaa5", "#ff8b94"], // Coral
    ["#dcedc1", "#ffd3a5"], // Mint
    ["#00d4ff", "#0099cc"], // Cyan
    ["#667eea", "#764ba2"], // Purple
  ];

  const iconPresets = [
    "📚",
    "📐",
    "⚡",
    "🧪",
    "🧬",
    "🌍",
    "🔬",
    "💻",
    "🎨",
    "🎵",
    "🏛️",
    "📖",
    "✏️",
    "🔢",
    "📊",
    "🎯",
  ];

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await SupabaseService.getSubjects();
      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await SupabaseService.createSubject(formData);

      if (error) throw error;

      setSubjects(prev => [data, ...prev]);
      setShowCreateForm(false);
      resetForm();

      alert("Subject created successfully!");
    } catch (error) {
      console.error("Error creating subject:", error);
      alert("Error creating subject. Please try again.");
    }
  };

  const handleUpdateSubject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingSubject) return;

    try {
      const { data, error } = await SupabaseService.updateSubject(
        editingSubject.id,
        formData,
      );

      if (error) throw error;

      setSubjects(prev =>
        prev.map(subject =>
          subject.id === editingSubject.id ? data : subject,
        ),
      );
      setShowCreateForm(false);
      setEditingSubject(null);
      resetForm();

      alert("Subject updated successfully!");
    } catch (error) {
      console.error("Error updating subject:", error);
      alert("Error updating subject. Please try again.");
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this subject? This will also delete all associated chapters and MCQs.",
      )
    )
      return;

    try {
      const { error } = await SupabaseService.deleteSubject(id);
      if (error) throw error;

      setSubjects(prev => prev.filter(subject => subject.id !== id));
      alert("Subject deleted successfully!");
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert("Error deleting subject. Please try again.");
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description || "",
      icon: subject.icon || "📚",
      color: subject.color,
      difficulty: subject.difficulty as
        | "Beginner"
        | "Intermediate"
        | "Advanced",
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "📚",
      color: ["#00d4ff", "#0099cc"],
      difficulty: "Beginner",
    });
    setEditingSubject(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Advanced":
        return "bg-red-500/10 text-red-500 border-red-500/20";
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
          <h1 className="text-3xl font-bold text-white">Subject Manager</h1>
          <p className="text-dark-400 mt-2">
            Create and manage subjects for organizing educational content
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Subject</span>
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => (
          <div
            key={subject.id}
            className="card group hover:scale-105 transition-transform duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${subject.color[0]}, ${subject.color[1]})`,
                  }}
                >
                  {subject.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {subject.name}
                  </h3>
                  <p className="text-dark-400 text-sm">
                    {subject.chapters} chapters
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditSubject(subject)}
                  className="text-dark-400 hover:text-white transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSubject(subject.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {subject.description && (
              <p className="text-dark-300 text-sm mb-4 line-clamp-3">
                {subject.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(subject.difficulty)}`}
              >
                {subject.difficulty}
              </span>
              <span className="text-dark-400 text-sm">
                {new Date(subject.created_at).toLocaleDateString()}
              </span>
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
                {editingSubject ? "Edit Subject" : "Create Subject"}
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

            <form
              onSubmit={
                editingSubject ? handleUpdateSubject : handleCreateSubject
              }
              className="space-y-6"
            >
              {/* Name */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter subject name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 h-24 resize-none"
                  placeholder="Describe what this subject covers"
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-8 gap-2 p-4 bg-dark-800 border border-dark-700 rounded-lg">
                  {iconPresets.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-colors ${
                        formData.icon === icon
                          ? "bg-primary-500 text-white"
                          : "bg-dark-700 text-dark-300 hover:bg-dark-600"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Color Theme
                </label>
                <div className="grid grid-cols-5 gap-2 p-4 bg-dark-800 border border-dark-700 rounded-lg">
                  {colorPresets.map((color, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-12 h-12 rounded-lg transition-transform ${
                        JSON.stringify(formData.color) === JSON.stringify(color)
                          ? "scale-110 ring-2 ring-white"
                          : "hover:scale-105"
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficulty}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      difficulty: e.target.value as
                        | "Beginner"
                        | "Intermediate"
                        | "Advanced",
                    }))
                  }
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Preview
                </label>
                <div className="p-4 bg-dark-800 border border-dark-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${formData.color[0]}, ${formData.color[1]})`,
                      }}
                    >
                      {formData.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">
                        {formData.name || "Subject Name"}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(formData.difficulty)}`}
                      >
                        {formData.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
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
                  {editingSubject ? "Update Subject" : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectManager;
