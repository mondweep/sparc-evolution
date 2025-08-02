import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../store/useAppStore'
import { authAPI } from '../services/api'
import { STORAGE_KEYS } from '../utils/constants'

export const useAuth = () => {
  const navigate = useNavigate()
  const {
    user,
    isAuthenticated,
    setUser,
    resetUser,
    setLoading,
    setError,
    clearError,
  } = useAppStore()

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      
      if (!token) {
        // Set demo user for development
        const demoUser = {
          id: 1,
          name: 'Demo Student',
          email: 'demo@example.com',
          role: 'student'
        }
        setUser(demoUser)
        return
      }

      try {
        setLoading(true)
        const response = await authAPI.me()
        setUser(response.data)
      } catch (error) {
        console.warn('Auth check failed, using demo mode:', error)
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        
        // Set demo user when API is not available
        const demoUser = {
          id: 1,
          name: 'Demo Student',
          email: 'demo@example.com',
          role: 'student'
        }
        setUser(demoUser)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [setUser, resetUser, setLoading])

  // Login function with demo mode fallback
  const login = async (credentials) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await authAPI.login(credentials)
      const { token, user: userData } = response.data
      
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
      setUser(userData)
      
      return { success: true, user: userData }
    } catch (error) {
      console.warn('Login failed, using demo mode:', error)
      
      // Demo mode - allow any credentials
      const demoUser = {
        id: 1,
        name: credentials.email?.split('@')[0] || 'Demo Student',
        email: credentials.email || 'demo@example.com',
        role: 'student'
      }
      
      setUser(demoUser)
      return { success: true, user: demoUser, demo: true }
    } finally {
      setLoading(false)
    }
  }

  // Register function with demo mode fallback
  const register = async (userData) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await authAPI.register(userData)
      const { token, user } = response.data
      
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      console.warn('Registration failed, using demo mode:', error)
      
      // Demo mode - allow any registration
      const demoUser = {
        id: 1,
        name: userData.name || 'Demo Student',
        email: userData.email || 'demo@example.com',
        role: 'student'
      }
      
      setUser(demoUser)
      return { success: true, user: demoUser, demo: true }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      resetUser()
      navigate('/')
    }
  }

  // Protected route wrapper
  const requireAuth = (callback) => {
    if (!isAuthenticated) {
      navigate('/login')
      return false
    }
    return callback ? callback() : true
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role || user?.roles?.includes(role)
  }

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission)
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    requireAuth,
    hasRole,
    hasPermission,
  }
}

export default useAuth