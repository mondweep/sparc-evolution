import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Mock data fallback for when API is not available
const MOCK_COURSES = [
  {
    id: 1,
    title: "Introduction to rUv-Swarm",
    description: "Learn the fundamentals of rUv-Swarm technology and distributed AI systems",
    difficulty: "beginner",
    duration: "4 weeks",
    lessonCount: 8,
    studentCount: 1247,
    rating: 4.8,
    instructor: "Dr. Sarah Chen",
    thumbnail: null
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
    instructor: "Prof. Michael Rodriguez",
    thumbnail: null
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
    instructor: "Emma Thompson",
    thumbnail: null
  }
]

const MOCK_LESSONS = [
  {
    id: 1,
    title: "What is rUv-Swarm?",
    duration: "15 min",
    type: "Video",
    completed: false
  },
  {
    id: 2,
    title: "Setting up Your Environment",
    duration: "20 min",
    type: "Interactive",
    completed: false
  },
  {
    id: 3,
    title: "Your First Swarm",
    duration: "25 min",
    type: "Coding",
    completed: false
  },
  {
    id: 4,
    title: "Understanding Swarm Intelligence",
    duration: "18 min",
    type: "Video",
    completed: false
  },
  {
    id: 5,
    title: "Coordination Patterns",
    duration: "22 min",
    type: "Interactive",
    completed: false
  }
]

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    })
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Helper function to handle API calls with fallback
const apiCallWithFallback = async (apiCall, fallbackData) => {
  try {
    const response = await apiCall()
    return response
  } catch (error) {
    console.warn('API call failed, using fallback data:', error.message)
    // Return mock data in the same format as API response
    return { data: fallbackData }
  }
}

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

// Courses API with fallback
export const coursesAPI = {
  getAll: () => apiCallWithFallback(
    () => api.get('/courses'),
    MOCK_COURSES
  ),
  getById: (id) => apiCallWithFallback(
    () => api.get(`/courses/${id}`),
    MOCK_COURSES.find(course => course.id === parseInt(id))
  ),
  getLessons: (courseId) => apiCallWithFallback(
    () => api.get(`/courses/${courseId}/lessons`),
    MOCK_LESSONS
  ),
  getLesson: (courseId, lessonId) => apiCallWithFallback(
    () => api.get(`/courses/${courseId}/lessons/${lessonId}`),
    MOCK_LESSONS.find(lesson => lesson.id === parseInt(lessonId))
  ),
}

// Progress API
export const progressAPI = {
  get: (courseId) => api.get(`/progress/${courseId}`),
  update: (courseId, lessonId, progress) =>
    api.put(`/progress/${courseId}/${lessonId}`, progress),
  complete: (courseId, lessonId) =>
    api.post(`/progress/${courseId}/${lessonId}/complete`),
}

// Quiz API
export const quizAPI = {
  get: (lessonId) => api.get(`/quizzes/${lessonId}`),
  submit: (lessonId, answers) => api.post(`/quizzes/${lessonId}/submit`, { answers }),
}

// Code execution API
export const codeAPI = {
  execute: (code, language = 'javascript') =>
    api.post('/code/execute', { code, language }),
  validate: (code, lessonId) =>
    api.post('/code/validate', { code, lessonId }),
}

// Export API
export const exportAPI = {
  // Export lesson to markdown
  exportLessonMarkdown: (lessonId) => {
    return api.post(`/export/lesson/${lessonId}/markdown`, {}, {
      responseType: 'blob',
      headers: {
        'Accept': 'text/markdown'
      }
    })
  },
  
  // Export quiz certificate
  exportQuizCertificate: (quizAttemptId) => {
    return api.post(`/export/quiz/${quizAttemptId}/certificate`, {}, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    })
  },
  
  // Export progress report as JSON
  exportProgressJSON: (options = {}) => {
    const params = new URLSearchParams(options)
    return api.get(`/export/progress/json?${params}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/json'
      }
    })
  },
  
  // Export progress report as CSV
  exportProgressCSV: () => {
    return api.get('/export/progress/csv', {
      responseType: 'blob',
      headers: {
        'Accept': 'text/csv'
      }
    })
  },
  
  // Generate course completion certificate
  generateCompletionCertificate: (courseId) => {
    return api.post(`/export/course/${courseId}/certificate`, {}, {
      responseType: 'blob', 
      headers: {
        'Accept': 'application/pdf'
      }
    })
  },
  
  // Get progress report template
  getProgressReport: (format = 'json') => {
    return api.get(`/export/progress/report?format=${format}`)
  }
}

export default api