import {
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Progress,
  Button,
  VStack,
  HStack,
  Badge,
  Avatar,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { FiPlay, FiCode, FiUsers, FiTrendingUp } from 'react-icons/fi'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../../store/useAppStore'
import { coursesAPI } from '../../services/api'

const Dashboard = () => {
  // Debug: Log that Dashboard is rendering
  console.log('🟢 Dashboard component is rendering')
  
  const navigate = useNavigate()
  const { 
    user, 
    courses,
    currentCourse, 
    progress, 
    lessons, 
    coursesLoaded,
    setCourses,
    setLoading,
    setError,
    isLoading,
    error 
  } = useAppStore()
  
  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      if (!coursesLoaded) {
        setLoading(true)
        try {
          const response = await coursesAPI.getAll()
          setCourses(response.data)
        } catch (err) {
          console.error('Failed to fetch courses:', err)
          setError('Failed to load courses')
        } finally {
          setLoading(false)
        }
      }
    }
    
    fetchCourses()
  }, [coursesLoaded, setCourses, setLoading, setError])
  
  // Calculate stats
  const totalLessons = lessons.length
  const completedLessons = Object.values(progress).filter(p => p.completed).length
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
  
  const recentLessons = lessons.slice(0, 3)
  const upcomingLessons = lessons.filter(lesson => 
    !progress[lesson.id]?.completed
  ).slice(0, 3)
  
  // Set current course to first available if none selected
  const displayCourse = currentCourse || courses[0] || null
  
  // Handle navigation
  const handleStartLesson = (lesson) => {
    navigate(`/courses/${displayCourse?.id}/lessons/${lesson.id}`)
  }
  
  const handleOpenEditor = () => {
    navigate('/editor')
  }
  
  const handleJoinSwarmLab = () => {
    console.log('🔥 Join Swarm Lab clicked - attempting navigation to /swarm-lab')
    console.log('🔍 Navigate function:', navigate)
    console.log('🔍 Current pathname:', window.location.pathname)
    try {
      navigate('/swarm-lab')
      console.log('✅ Navigation attempted successfully')
      // Check if navigation actually happened after a brief delay
      setTimeout(() => {
        console.log('🔍 New pathname after navigation:', window.location.pathname)
      }, 100)
    } catch (error) {
      console.error('❌ Navigation error:', error)
    }
  }
  
  const handleResumeLearning = () => {
    if (displayCourse) {
      navigate(`/courses/${displayCourse.id}`)
    } else {
      navigate('/courses')
    }
  }

  return (
    <Box>
      <Heading mb="6">Welcome back, {user?.name || 'Student'}!</Heading>
      
      {/* Show loading state */}
      {isLoading && (
        <Box display="flex" justifyContent="center" py="8">
          <Spinner size="lg" color="blue.500" />
        </Box>
      )}
      
      {/* Show error state */}
      {error && (
        <Alert status="error" mb="6">
          <AlertIcon />
          {error}
        </Alert>
      )}
      
      {/* Stats Grid */}
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap="6" mb="8">
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Progress</StatLabel>
              <StatNumber>{Math.round(progressPercentage)}%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {completedLessons} of {totalLessons} lessons
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Current Course</StatLabel>
              <StatNumber fontSize="lg">
                {displayCourse?.title || 'None'}
              </StatNumber>
              <StatHelpText>
                {displayCourse?.difficulty && (
                  <Badge colorScheme="blue">{displayCourse.difficulty}</Badge>
                )}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Swarm Points</StatLabel>
              <StatNumber>1,247</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                +23% this week
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Streak</StatLabel>
              <StatNumber>7 days</StatNumber>
              <StatHelpText>Keep it up!</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="6">
        {/* Recent Activity */}
        <GridItem>
          <Card>
            <CardHeader>
              <Heading size="md">Continue Learning</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing="4" align="stretch">
                {upcomingLessons.map((lesson) => (
                  <Flex
                    key={lesson.id}
                    p="4"
                    borderWidth="1px"
                    borderRadius="md"
                    justify="space-between"
                    align="center"
                  >
                    <HStack>
                      <Box
                        p="2"
                        bg="blue.100"
                        borderRadius="md"
                        color="blue.600"
                      >
                        <FiPlay />
                      </Box>
                      <VStack align="start" spacing="1">
                        <Text fontWeight="semibold">{lesson.title}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {lesson.duration} • {lesson.type}
                        </Text>
                      </VStack>
                    </HStack>
                    <Button 
                      size="sm" 
                      colorScheme="blue"
                      onClick={() => handleStartLesson(lesson)}
                    >
                      Start
                    </Button>
                  </Flex>
                ))}
                
                {upcomingLessons.length === 0 && (
                  <Text color="gray.500" textAlign="center" py="8">
                    All lessons completed! 🎉
                  </Text>
                )}
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        {/* Quick Actions & Progress */}
        <GridItem>
          <VStack spacing="6">
            {/* Quick Actions */}
            <Card w="full">
              <CardHeader>
                <Heading size="md">Quick Actions</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing="3">
                  <Button 
                    leftIcon={<FiCode />} 
                    w="full" 
                    variant="outline"
                    onClick={handleOpenEditor}
                  >
                    Open Code Editor
                  </Button>
                  <Button 
                    leftIcon={<FiUsers />} 
                    w="full" 
                    variant="outline"
                    onClick={() => {
                      alert('🚨 BUTTON CLICKED - Join Swarm Lab');
                      console.log('🚨 BUTTON CLICKED - Join Swarm Lab');
                      handleJoinSwarmLab();
                    }}
                  >
                    Join Swarm Lab
                  </Button>
                  <Button 
                    leftIcon={<FiPlay />} 
                    w="full" 
                    colorScheme="blue"
                    onClick={handleResumeLearning}
                  >
                    Resume Learning
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            {/* Progress Overview */}
            <Card w="full">
              <CardHeader>
                <Heading size="md">Learning Progress</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing="4">
                  <Box w="full">
                    <Flex justify="space-between" mb="2">
                      <Text fontSize="sm">Overall Progress</Text>
                      <Text fontSize="sm">{Math.round(progressPercentage)}%</Text>
                    </Flex>
                    <Progress value={progressPercentage} colorScheme="blue" />
                  </Box>
                  
                  <Box w="full">
                    <Flex justify="space-between" mb="2">
                      <Text fontSize="sm">Code Challenges</Text>
                      <Text fontSize="sm">75%</Text>
                    </Flex>
                    <Progress value={75} colorScheme="green" />
                  </Box>
                  
                  <Box w="full">
                    <Flex justify="space-between" mb="2">
                      <Text fontSize="sm">Swarm Interactions</Text>
                      <Text fontSize="sm">60%</Text>
                    </Flex>
                    <Progress value={60} colorScheme="purple" />
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default Dashboard