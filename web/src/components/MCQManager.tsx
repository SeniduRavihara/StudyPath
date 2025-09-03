import { Edit, HelpCircle, Plus, Save, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { SupabaseService } from "../lib/supabaseService";

interface MCQ {
  id: string;
  chapter_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  created_at: string;
  updated_at: string;
}

interface Chapter {
  id: string;
  title: string;
  subjects: {
    id: string;
    name: string;
    color: string;
  };
}

const MCQManager: React.FC = () => {
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMCQ, setEditingMCQ] = useState<MCQ | null>(null);
  const [formData, setFormData] = useState({
    chapter_id: "",
    question: "",
    options: ["", "", "", ""],
    correct_answer: 0,
    explanation: "",
    difficulty: "medium" as "easy" | "medium" | "hard",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mcqsData, chaptersData] = await Promise.all([
        SupabaseService.getMCQs(),
        SupabaseService.getChapters(),
      ]);

      if (mcqsData.data) setMcqs(mcqsData.data);
      if (chaptersData.data) setChapters(chaptersData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingMCQ) {
        await SupabaseService.updateMCQ(editingMCQ.id, formData);
      } else {
        await SupabaseService.createMCQ(formData);
      }

      setShowForm(false);
      setEditingMCQ(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving MCQ:", error);
    }
  };

  const handleEdit = (mcq: MCQ) => {
    setEditingMCQ(mcq);
    setFormData({
      chapter_id: mcq.chapter_id,
      question: mcq.question,
      options: [...mcq.options],
      correct_answer: mcq.correct_answer,
      explanation: mcq.explanation,
      difficulty: mcq.difficulty,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this MCQ?")) {
      try {
        await SupabaseService.deleteMCQ(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting MCQ:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      chapter_id: "",
      question: "",
      options: ["", "", "", ""],
      correct_answer: 0,
      explanation: "",
      difficulty: "medium",
    });
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, ""],
      }));
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        options: newOptions,
        correct_answer:
          prev.correct_answer >= index
            ? Math.max(0, prev.correct_answer - 1)
            : prev.correct_answer,
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-500 bg-green-500/10";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10";
      case "hard":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
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
          <h1 className="text-3xl font-bold text-white">MCQ Management</h1>
          <p className="text-dark-400 mt-2">
            Create and manage multiple choice questions for your students
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New MCQ</span>
        </button>
      </div>

      {/* MCQ Form */}
      {showForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {editingMCQ ? "Edit MCQ" : "Create New MCQ"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingMCQ(null);
                resetForm();
              }}
              className="text-dark-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Chapter
                </label>
                <select
                  value={formData.chapter_id}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      chapter_id: e.target.value,
                    }))
                  }
                  className="input-field w-full"
                  required
                >
                  <option value="">Select a chapter</option>
                  {chapters.map(chapter => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.subjects.name} - {chapter.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      difficulty: e.target.value as any,
                    }))
                  }
                  className="input-field w-full"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Question
              </label>
              <textarea
                value={formData.question}
                onChange={e =>
                  setFormData(prev => ({ ...prev, question: e.target.value }))
                }
                className="input-field w-full h-24 resize-none"
                placeholder="Enter your question here..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Options
              </label>
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="correct_answer"
                      value={index}
                      checked={formData.correct_answer === index}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          correct_answer: parseInt(e.target.value),
                        }))
                      }
                      className="text-primary-500"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={e => updateOption(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-accent-red hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {formData.options.length < 6 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="btn-secondary text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Explanation
              </label>
              <textarea
                value={formData.explanation}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    explanation: e.target.value,
                  }))
                }
                className="input-field w-full h-20 resize-none"
                placeholder="Explain why this answer is correct..."
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingMCQ(null);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Save className="w-4 h-4 mr-2" />
                {editingMCQ ? "Update MCQ" : "Create MCQ"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MCQ List */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-6">
          All MCQs ({mcqs.length})
        </h3>

        {mcqs.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-dark-400 mx-auto mb-4" />
            <p className="text-dark-400 text-lg">No MCQs created yet</p>
            <p className="text-dark-500">
              Start by creating your first MCQ question
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mcqs.map(mcq => {
              const chapter = chapters.find(c => c.id === mcq.chapter_id);
              return (
                <div
                  key={mcq.id}
                  className="p-4 bg-dark-700 rounded-lg border border-dark-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {chapter && (
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: chapter.subjects.color,
                              }}
                            />
                            <span className="text-sm text-dark-300">
                              {chapter.subjects.name} - {chapter.title}
                            </span>
                          </div>
                        )}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(mcq.difficulty)}`}
                        >
                          {mcq.difficulty}
                        </span>
                      </div>

                      <p className="text-white font-medium mb-3">
                        {mcq.question}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                        {mcq.options.map((option, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded text-sm ${
                              index === mcq.correct_answer
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-dark-600 text-dark-300"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}. {option}
                          </div>
                        ))}
                      </div>

                      <p className="text-dark-400 text-sm">
                        <span className="font-medium">Explanation:</span>{" "}
                        {mcq.explanation}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(mcq)}
                        className="p-2 text-dark-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(mcq.id)}
                        className="p-2 text-dark-400 hover:text-accent-red hover:bg-dark-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQManager;
