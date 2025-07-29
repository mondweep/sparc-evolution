import {
  Box,
  Grid,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Button,
  Badge,
  useColorModeValue,
  VStack,
  HStack,
  Progress,
  Image,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { coursesAPI } from '../services/api'
import useAppStore from '../store/useAppStore'

const CoursesPage = () => {
  const navigate = useNavigate()
  const { 
    courses, 
    setCourses, 
    isLoading, 
    error, 
    setLoading, 
    setError, 
    clearError,
    setCurrentCourse, 
    progress,
    coursesLoaded,
    initializeMockData
  } = useAppStore()
  
  const [apiError, setApiError] = useState(null)
  
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  useEffect(() => {
    const loadCourses = async () => {
      // Clear any previous errors
      clearError()
      setApiError(null)
      
      try {
        setLoading(true)
        const response = await coursesAPI.getAll()
        setCourses(response.data)
        console.log('Loaded courses from API:', response.data)
      } catch (error) {
        const errorMessage = 'Failed to load courses from API, using demo data'
        setApiError(errorMessage)
        console.warn(errorMessage, error)
        
        // Initialize with mock data if API fails
        initializeMockData()
      } finally {
        setLoading(false)
      }
    }

    // Only load if not already loaded
    if (!coursesLoaded) {
      loadCourses()
    }
  }, [coursesLoaded, setLoading, clearError, setCourses, initializeMockData])

  const handleStartCourse = (course) => {
    setCurrentCourse(course)
    navigate(`/courses/${course.id}`)
  }

  const calculateProgress = (courseId) => {
    // For now, calculate progress based on all lessons in the system
    // In a real implementation, you'd filter lessons by courseId
    const allProgress = Object.entries(progress)
    
    if (allProgress.length === 0) return 0
    
    const completed = allProgress.filter(([_, prog]) => prog.completed).length
    return (completed / allProgress.length) * 100
  }

  // Show loading spinner
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <VStack spacing="4">
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text>Loading courses...</Text>
        </VStack>
      </Box>
    )
  }

  return (
    <Box>
      <VStack spacing="6" align="stretch">
        <Box>
          <Heading size="xl" mb="2">Available Courses</Heading>
          <Text color="gray.600">
            Explore our comprehensive rUv swarm intelligence courses
          </Text>
        </Box>

        {/* Show API error alert if present */}
        {apiError && (
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Demo Mode Active</AlertTitle>
              <AlertDescription>
                {apiError}. You're viewing sample course content.
              </AlertDescription>
            </Box>
          </Alert>
        )}
        
        {/* Show general error if present */}
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        )}

        <Grid
          templateColumns="repeat(auto-fill, minmax(350px, 1fr))"
          gap="6"
        >
          {courses.map((course) => {
            const courseProgress = calculateProgress(course.id)
            const isStarted = courseProgress > 0

            return (
              <Card
                key={course.id}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                shadow="sm"
                _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                {course.thumbnail && (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    h="200px"
                    w="full"
                    objectFit="cover"
                    borderTopRadius="md"
                  />
                )}
                
                <CardHeader>
                  <VStack align="start" spacing="2">
                    <HStack justify="space-between" w="full">
                      <Badge
                        colorScheme={
                          course.difficulty === 'beginner' ? 'green' :
                          course.difficulty === 'intermediate' ? 'yellow' : 'red'
                        }
                      >
                        {course.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {course.duration || '4 weeks'}
                      </Badge>
                    </HStack>
                    
                    <Heading size="md">{course.title}</Heading>
                    
                    <Text fontSize="sm" color="gray.600">
                      {course.description}
                    </Text>
                  </VStack>
                </CardHeader>

                <CardBody pt="0">
                  <VStack spacing="4" align="stretch">
                    {isStarted && (
                      <Box>
                        <HStack justify="space-between" mb="2">
                          <Text fontSize="sm">Progress</Text>
                          <Text fontSize="sm">{Math.round(courseProgress)}%</Text>
                        </HStack>
                        <Progress
                          value={courseProgress}
                          colorScheme="blue"
                          size="sm"
                        />
                      </Box>
                    )}

                    <VStack spacing="2" align="stretch">
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.600">Lessons:</Text>
                        <Text fontSize="sm">{course.lessonCount || 12}</Text>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.600">Students:</Text>
                        <Text fontSize="sm">{course.studentCount || 1247}</Text>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.600">Rating:</Text>
                        <Text fontSize="sm">★ {course.rating || 4.8}</Text>
                      </HStack>
                    </VStack>

                    <Button
                      colorScheme="blue"
                      onClick={() => handleStartCourse(course)}
                      w="full"
                    >
                      {isStarted ? 'Continue' : 'Start Course'}
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            )
          })}
        </Grid>

        {courses.length === 0 && !isLoading && (
          <Box textAlign="center" py="20">
            <Text fontSize="lg" color="gray.500">
              No courses available at the moment.
            </Text>
            <Text color="gray.400" mt="2">
              Check back soon for new content!
            </Text>
            <Button 
              mt="4" 
              colorScheme="blue" 
              onClick={() => initializeMockData()}
            >
              Load Demo Courses
            </Button>
          </Box>
        )}
      </VStack>
    </Box>
  )
}

export default CoursesPage