// Mock subscription service for testing the flow UI without database interactions

export interface MockSubject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: [string, string];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  chapters: number;
  completed: number;
  xp: number;
  streak: number;
  isSubscribed: boolean;
}

// Mock subjects data
const mockSubjects: MockSubject[] = [
  {
    id: "1",
    name: "Full-Stack Developer",
    description: "Learn complete web development from frontend to backend",
    icon: "code-slash",
    color: ["#667eea", "#764ba2"],
    difficulty: "Beginner",
    chapters: 12,
    completed: 3,
    xp: 450,
    streak: 7,
    isSubscribed: true,
  },
  {
    id: "2",
    name: "React Native",
    description: "Build mobile apps with React Native",
    icon: "phone-portrait",
    color: ["#4ecdc4", "#44a08d"],
    difficulty: "Intermediate",
    chapters: 8,
    completed: 1,
    xp: 200,
    streak: 3,
    isSubscribed: true,
  },
  {
    id: "3",
    name: "Python Programming",
    description: "Master Python from basics to advanced concepts",
    icon: "logo-python",
    color: ["#ff6b6b", "#ee5a24"],
    difficulty: "Beginner",
    chapters: 15,
    completed: 0,
    xp: 0,
    streak: 0,
    isSubscribed: false,
  },
  {
    id: "4",
    name: "Machine Learning",
    description: "Introduction to AI and machine learning",
    icon: "brain",
    color: ["#f093fb", "#f5576c"],
    difficulty: "Advanced",
    chapters: 10,
    completed: 0,
    xp: 0,
    streak: 0,
    isSubscribed: false,
  },
  {
    id: "5",
    name: "Data Structures",
    description: "Learn fundamental data structures and algorithms",
    icon: "git-branch",
    color: ["#45b7d1", "#96ceb4"],
    difficulty: "Intermediate",
    chapters: 9,
    completed: 2,
    xp: 300,
    streak: 5,
    isSubscribed: true,
  },
];

export class MockSubscriptionService {
  // Get all available subjects
  static getAllSubjects(): MockSubject[] {
    return mockSubjects;
  }

  // Get user's subscribed subjects
  static getSubscribedSubjects(): MockSubject[] {
    return mockSubjects.filter(subject => subject.isSubscribed);
  }

  // Subscribe to a subject
  static subscribeToSubject(
    subjectId: string,
  ): Promise<{ success: boolean; message: string }> {
    return new Promise(resolve => {
      setTimeout(() => {
        const subject = mockSubjects.find(s => s.id === subjectId);
        if (subject) {
          subject.isSubscribed = true;
          resolve({
            success: true,
            message: `Successfully subscribed to ${subject.name}`,
          });
        } else {
          resolve({ success: false, message: "Subject not found" });
        }
      }, 500); // Simulate network delay
    });
  }

  // Unsubscribe from a subject
  static unsubscribeFromSubject(
    subjectId: string,
  ): Promise<{ success: boolean; message: string }> {
    return new Promise(resolve => {
      setTimeout(() => {
        const subject = mockSubjects.find(s => s.id === subjectId);
        if (subject) {
          subject.isSubscribed = false;
          resolve({
            success: true,
            message: `Successfully unsubscribed from ${subject.name}`,
          });
        } else {
          resolve({ success: false, message: "Subject not found" });
        }
      }, 500); // Simulate network delay
    });
  }

  // Get subject by ID
  static getSubjectById(subjectId: string): MockSubject | null {
    return mockSubjects.find(s => s.id === subjectId) || null;
  }

  // Update subject progress (for testing)
  static updateSubjectProgress(
    subjectId: string,
    completed: number,
    xp: number,
    streak: number,
  ): void {
    const subject = mockSubjects.find(s => s.id === subjectId);
    if (subject) {
      subject.completed = completed;
      subject.xp = xp;
      subject.streak = streak;
    }
  }
}
