import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useAppStore = create(
  devtools(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      
      // Course state
      courses: [],
      currentCourse: null,
      currentLesson: null,
      lessons: [],
      progress: {},
      coursesLoaded: false,
      
      // UI state
      isLoading: false,
      error: null,
      sidebarOpen: true,
      
      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setCourses: (courses) => set({ courses, coursesLoaded: true }),
      
      setCurrentCourse: (course) => set({ currentCourse: course }),
      
      setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
      
      setLessons: (lessons) => set({ lessons }),
      
      updateProgress: (lessonId, progress) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [lessonId]: progress,
          },
        })),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      // Reset functions
      resetUser: () => set({ user: null, isAuthenticated: false }),
      
      resetCourse: () => set({
        courses: [],
        currentCourse: null,
        currentLesson: null,
        lessons: [],
        progress: {},
        coursesLoaded: false,
      }),
      
      // Initialize with mock data for demo
      initializeMockData: () => set((state) => {
        if (!state.coursesLoaded) {
          return {
            courses: [
              {
                id: 1,
                title: "Introduction to rUv-Swarm",
                description: "Learn the fundamentals of rUv-Swarm technology and distributed AI systems",
                difficulty: "beginner",
                duration: "4 weeks",
                lessonCount: 8,
                studentCount: 1247,
                rating: 4.8,
                instructor: "Dr. Sarah Chen"
              },
              {
                id: 2,
                title: "Advanced Swarm Patterns",
                description: "Master complex coordination patterns and fault-tolerant swarm architectures",
                difficulty: "advanced",
                duration: "6 weeks",
                lessonCount: 12,
                studentCount: 623,
                rating: 4.9,
                instructor: "Prof. Michael Rodriguez"
              },
              {
                id: 3,
                title: "AI-Powered Development",
                description: "Build intelligent applications using AI agents and swarm coordination",
                difficulty: "intermediate",
                duration: "5 weeks",
                lessonCount: 10,
                studentCount: 891,
                rating: 4.7,
                instructor: "Emma Thompson"
              }
            ],
            lessons: [
              {
                id: '1-1',
                title: "What is rUv-Swarm?",
                duration: "15 min",
                type: "Video",
                completed: false
              },
              {
                id: '1-2',
                title: "Setting up Your Environment",
                duration: "20 min",
                type: "Interactive",
                completed: false
              },
              {
                id: '1-3',
                title: "Your First Swarm",
                duration: "25 min",
                type: "Coding",
                completed: false
              },
              {
                id: '1-4',
                title: "Understanding Swarm Intelligence",
                duration: "18 min",
                type: "Video",
                completed: false
              },
              {
                id: '1-5',
                title: "Coordination Patterns",
                duration: "22 min",
                type: "Interactive",
                completed: false
              }
            ],
            progress: {
              '1-1': { completed: true, score: 95 },
              '1-2': { completed: true, score: 88 },
              '1-3': { completed: false, score: 0 }
            },
            coursesLoaded: true
          }
        }
        return state
      }),
    }),
    {
      name: 'ruv-swarm-app-store',
    }
  )
)

export default useAppStore