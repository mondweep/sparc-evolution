import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import EditorPage from './pages/EditorPage'
import SwarmLabPage from './pages/SwarmLabPage'
import ExplorePage from './pages/ExplorePage'
import LessonViewer from './components/LessonViewer/LessonViewer'
import Quiz from './components/Quiz/Quiz'
import DemoPage from './demo/DemoPage'
import useAppStore from './store/useAppStore'

function App() {
  const { initializeMockData, coursesLoaded } = useAppStore()
  
  // Initialize app data on first load
  useEffect(() => {
    if (!coursesLoaded) {
      initializeMockData()
    }
  }, [initializeMockData, coursesLoaded])
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CoursesPage />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonViewer />} />
        <Route path="/courses/:courseId/lessons/:lessonId/quiz" element={<Quiz />} />
        <Route path="/lessons" element={<div>Lessons List</div>} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/swarm" element={<SwarmLabPage />} />
        <Route path="/swarm-lab" element={<SwarmLabPage />} />
        <Route path="/progress" element={<div>Progress Page - Coming Soon</div>} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/favorites" element={<div>Favorites Page - Coming Soon</div>} />
        <Route path="/settings" element={<div>Settings Page - Coming Soon</div>} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Layout>
  )
}

export default App
