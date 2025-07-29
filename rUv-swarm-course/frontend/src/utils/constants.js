// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  COURSES: {
    BASE: '/courses',
    BY_ID: (id) => `/courses/${id}`,
    LESSONS: (courseId) => `/courses/${courseId}/lessons`,
    LESSON: (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}`,
  },
  PROGRESS: {
    BASE: '/progress',
    BY_COURSE: (courseId) => `/progress/${courseId}`,
    BY_LESSON: (courseId, lessonId) => `/progress/${courseId}/${lessonId}`,
    COMPLETE: (courseId, lessonId) => `/progress/${courseId}/${lessonId}/complete`,
  },
  QUIZ: {
    BASE: '/quizzes',
    BY_LESSON: (lessonId) => `/quizzes/${lessonId}`,
    SUBMIT: (lessonId) => `/quizzes/${lessonId}/submit`,
  },
  CODE: {
    EXECUTE: '/code/execute',
    VALIDATE: '/code/validate',
  },
}

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'rUv Swarm Course Platform',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
}

// Lesson Types
export const LESSON_TYPES = {
  VIDEO: 'video',
  TEXT: 'text',
  INTERACTIVE: 'interactive',
  QUIZ: 'quiz',
  CODE: 'code',
}

// Quiz Types
export const QUIZ_TYPES = {
  MULTIPLE_CHOICE: 'multiple-choice',
  MULTIPLE_SELECT: 'multiple-select',
  TRUE_FALSE: 'true-false',
  SHORT_ANSWER: 'short-answer',
  CODE: 'code',
}

// Progress Status
export const PROGRESS_STATUS = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
}

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
}

// Color Schemes
export const DIFFICULTY_COLORS = {
  [DIFFICULTY_LEVELS.BEGINNER]: 'green',
  [DIFFICULTY_LEVELS.INTERMEDIATE]: 'yellow',
  [DIFFICULTY_LEVELS.ADVANCED]: 'red',
}

// Programming Languages
export const PROGRAMMING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', extension: 'js' },
  { value: 'python', label: 'Python', extension: 'py' },
  { value: 'java', label: 'Java', extension: 'java' },
  { value: 'cpp', label: 'C++', extension: 'cpp' },
  { value: 'rust', label: 'Rust', extension: 'rs' },
  { value: 'go', label: 'Go', extension: 'go' },
  { value: 'typescript', label: 'TypeScript', extension: 'ts' },
]

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'chakra-ui-color-mode',
  SIDEBAR_STATE: 'sidebarOpen',
  COURSE_PROGRESS: 'courseProgress',
}

// Feature Flags
export const FEATURES = {
  CODE_EXECUTION: import.meta.env.VITE_ENABLE_CODE_EXECUTION === 'true',
  SWARM_LAB: import.meta.env.VITE_ENABLE_SWARM_LAB === 'true',
  REAL_TIME: import.meta.env.VITE_ENABLE_REAL_TIME === 'true',
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  LOGOUT: 'Successfully logged out!',
  COURSE_COMPLETE: 'Congratulations! Course completed!',
  LESSON_COMPLETE: 'Lesson completed successfully!',
  QUIZ_PASSED: 'Quiz passed! Well done!',
  CODE_SAVED: 'Code saved successfully!',
  PROGRESS_SAVED: 'Progress saved!',
}

export default {
  API_ENDPOINTS,
  APP_CONFIG,
  LESSON_TYPES,
  QUIZ_TYPES,
  PROGRESS_STATUS,
  DIFFICULTY_LEVELS,
  DIFFICULTY_COLORS,
  PROGRAMMING_LANGUAGES,
  STORAGE_KEYS,
  FEATURES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
}