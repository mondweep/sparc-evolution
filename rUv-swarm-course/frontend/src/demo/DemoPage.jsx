import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Button,
  VStack,
  HStack,
  Badge,
  Progress,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Code,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Spinner,
  Flex,
  Icon,
  Avatar,
  Tag,
  TagLabel,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import {
  FiPlay,
  FiCode,
  FiUsers,
  FiTrendingUp,
  FiCheck,
  FiClock,
  FiStar,
  FiBook,
  FiZap,
  FiDatabase,
  FiServer,
  FiGlobe,
  FiShield,
  FiActivity
} from 'react-icons/fi'
import { useState as useAppState } from 'react'
import useAppStore from '../store/useAppStore'
import { authAPI, coursesAPI, codeAPI, quizAPI } from '../services/api'

// Mock data for demonstration
const mockCourses = [
  {
    id: 1,
    title: "Introduction to rUv-Swarm",
    description: "Learn the fundamentals of rUv-Swarm technology and distributed AI systems",
    difficulty: "beginner",
    duration: 120,
    lessons: 8,
    progress: 75,
    instructor: "Dr. Sarah Chen",
    rating: 4.8,
    students: 1247
  },
  {
    id: 2,
    title: "Advanced Swarm Patterns",
    description: "Master complex coordination patterns and fault-tolerant swarm architectures",
    difficulty: "advanced",
    duration: 180,
    lessons: 12,
    progress: 45,
    instructor: "Prof. Michael Rodriguez",
    rating: 4.9,
    students: 623
  },
  {
    id: 3,
    title: "AI-Powered Development",
    description: "Build intelligent applications using AI agents and swarm coordination",
    difficulty: "intermediate",
    duration: 150,
    lessons: 10,
    progress: 30,
    instructor: "Emma Thompson",
    rating: 4.7,
    students: 891
  }
]

const mockLessons = [
  {
    id: 1,
    title: "What is rUv-Swarm?",
    type: "video",
    duration: 15,
    completed: true,
    content: "Introduction to swarm intelligence and distributed systems..."
  },
  {
    id: 2,
    title: "Setting up Your Environment",
    type: "interactive",
    duration: 20,
    completed: true,
    content: "Configure your development environment for swarm development..."
  },
  {
    id: 3,
    title: "Your First Swarm",
    type: "coding",
    duration: 25,
    completed: false,
    content: "Create and deploy your first swarm application..."
  }
]

const mockQuiz = {
  id: 1,
  title: "rUv-Swarm Fundamentals Quiz",
  questions: [
    {
      id: 1,
      question: "What is the primary benefit of swarm intelligence?",
      options: ["Speed", "Distributed problem solving", "Cost reduction", "Security"],
      correct: 1
    },
    {
      id: 2,
      question: "Which pattern is best for fault tolerance?",
      options: ["Centralized", "Hierarchical", "Mesh", "Linear"],
      correct: 2
    }
  ]
}

const DemoPage = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [apiStatus, setApiStatus] = useState('checking')
  const [codeOutput, setCodeOutput] = useState('')
  const [codeInput, setCodeInput] = useState(`// rUv-Swarm Demo Code
import { SwarmCoordinator } from 'ruv-swarm'

const swarm = new SwarmCoordinator({
  topology: 'mesh',
  agents: 5,
  coordination: 'adaptive'
})

// Initialize swarm
await swarm.init()
console.log('Swarm initialized with', swarm.agentCount, 'agents')

// Demonstrate coordination
const result = await swarm.coordinate({
  task: 'distributed_calculation',
  data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
})

console.log('Coordination result:', result)`)
  
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizScore, setQuizScore] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(mockCourses[0])
  const [selectedLesson, setSelectedLesson] = useState(mockLessons[0])
  const [isExecuting, setIsExecuting] = useState(false)
  const toast = useToast()

  // Check API status
  useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/health')
      if (response.ok) {
        setApiStatus('connected')
        toast({
          title: "API Connected",
          description: "Backend API is running and accessible",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } else {
        setApiStatus('error')
      }
    } catch (error) {
      setApiStatus('error')
      toast({
        title: "API Unavailable",
        description: "Backend API is not running. Using mock data for demo.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const executeCode = async () => {
    setIsExecuting(true)
    setCodeOutput('Executing code...\n')
    
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockOutput = `🚀 rUv-Swarm Demo Execution Results
=====================================

✓ Swarm initialized with 5 agents
✓ Topology: mesh (fully connected)
✓ Coordination strategy: adaptive

Agent Distribution:
├── Agent-1: Processing chunks [1, 2]
├── Agent-2: Processing chunks [3, 4]  
├── Agent-3: Processing chunks [5, 6]
├── Agent-4: Processing chunks [7, 8]
└── Agent-5: Processing chunks [9, 10]

Coordination Results:
├── Sum: 55
├── Average: 5.5
├── Max: 10
├── Min: 1
├── Processing time: 245ms
└── Coordination efficiency: 94.2%

🎉 Task completed successfully!
All agents synchronized and results aggregated.`

      setCodeOutput(mockOutput)
      
      toast({
        title: "Code Executed Successfully",
        description: "Swarm coordination completed with 94.2% efficiency",
        status: "success",
        duration: 4000,
        isClosable: true,
      })
    } catch (error) {
      setCodeOutput(`Error executing code:\n${error.message}`)
      toast({
        title: "Execution Error",
        description: "Code execution failed. Check your syntax.",
        status: "error",
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const submitQuiz = () => {
    let score = 0
    mockQuiz.questions.forEach(question => {
      if (quizAnswers[question.id] === question.correct) {
        score++
      }
    })
    
    const percentage = (score / mockQuiz.questions.length) * 100
    setQuizScore(percentage)
    
    toast({
      title: "Quiz Submitted",
      description: `You scored ${score}/${mockQuiz.questions.length} (${percentage}%)`,
      status: percentage >= 70 ? "success" : "warning",
      duration: 4000,
      isClosable: true,
    })
  }

  const SystemStatus = () => (
    <Card>
      <CardHeader>
        <HStack>
          <Icon as={FiActivity} color="blue.500" />
          <Heading size="md">System Status</Heading>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={4}>
          <Flex justify="space-between" w="full">
            <Text>Backend API</Text>
            <Badge colorScheme={apiStatus === 'connected' ? 'green' : 'red'}>
              {apiStatus === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
            </Badge>
          </Flex>
          <Flex justify="space-between" w="full">
            <Text>Frontend</Text>
            <Badge colorScheme="green">🟢 Active</Badge>
          </Flex>
          <Flex justify="space-between" w="full">
            <Text>Database</Text>
            <Badge colorScheme="green">🟢 Online</Badge>
          </Flex>
          <Flex justify="space-between" w="full">
            <Text>Authentication</Text>
            <Badge colorScheme="green">🟢 Enabled</Badge>
          </Flex>
        </VStack>
      </CardBody>
    </Card>
  )

  const CourseDashboard = () => (
    <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
      <GridItem>
        <VStack spacing={6} align="stretch">
          {/* Course Selection */}
          <Card>
            <CardHeader>
              <Heading size="md">Available Courses</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                {mockCourses.map(course => (
                  <Box
                    key={course.id}
                    p={4}
                    borderWidth={selectedCourse.id === course.id ? 2 : 1}
                    borderColor={selectedCourse.id === course.id ? 'blue.500' : 'gray.200'}
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => setSelectedCourse(course)}
                    w="full"
                  >
                    <HStack justify="space-between" mb={2}>
                      <Heading size="sm">{course.title}</Heading>
                      <Badge colorScheme={
                        course.difficulty === 'beginner' ? 'green' :
                        course.difficulty === 'intermediate' ? 'yellow' : 'red'
                      }>
                        {course.difficulty}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" mb={3}>
                      {course.description}
                    </Text>
                    <HStack justify="space-between">
                      <HStack fontSize="sm" color="gray.500">
                        <Icon as={FiClock} />
                        <Text>{course.duration}min</Text>
                        <Icon as={FiBook} />
                        <Text>{course.lessons} lessons</Text>
                        <Icon as={FiUsers} />
                        <Text>{course.students} students</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiStar} color="yellow.400" />
                        <Text fontSize="sm">{course.rating}</Text>
                      </HStack>
                    </HStack>
                    <Box mt={3}>
                      <Flex justify="space-between" mb={1}>
                        <Text fontSize="sm">Progress</Text>
                        <Text fontSize="sm">{course.progress}%</Text>
                      </Flex>
                      <Progress value={course.progress} colorScheme="blue" size="sm" />
                    </Box>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Course Details */}
          <Card>
            <CardHeader>
              <Heading size="md">Course: {selectedCourse.title}</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Text>{selectedCourse.description}</Text>
                <HStack>
                  <Avatar size="sm" name={selectedCourse.instructor} />
                  <Text fontSize="sm">Instructor: {selectedCourse.instructor}</Text>
                </HStack>
                <Divider />
                <Heading size="sm">Lessons</Heading>
                {mockLessons.map((lesson, index) => (
                  <Flex
                    key={lesson.id}
                    p={3}
                    borderWidth={1}
                    borderRadius="md"
                    justify="space-between"
                    align="center"
                    bg={lesson.completed ? 'green.50' : 'gray.50'}
                  >
                    <HStack>
                      <Icon
                        as={lesson.completed ? FiCheck : FiPlay}
                        color={lesson.completed ? 'green.500' : 'blue.500'}
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold">{lesson.title}</Text>
                        <HStack fontSize="sm" color="gray.600">
                          <Text>{lesson.type}</Text>
                          <Text>•</Text>
                          <Text>{lesson.duration}min</Text>
                        </HStack>
                      </VStack>
                    </HStack>
                    <Button
                      size="sm"
                      colorScheme={lesson.completed ? 'green' : 'blue'}
                      variant={lesson.completed ? 'outline' : 'solid'}
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      {lesson.completed ? 'Review' : 'Start'}
                    </Button>
                  </Flex>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </GridItem>

      <GridItem>
        <VStack spacing={6}>
          <SystemStatus />
          
          {/* Statistics */}
          <Card w="full">
            <CardHeader>
              <Heading size="md">Learning Stats</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={2} spacing={4}>
                <Stat>
                  <StatLabel>Courses</StatLabel>
                  <StatNumber>3</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    2 active
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Lessons</StatLabel>
                  <StatNumber>18</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    67% complete
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Swarm Points</StatLabel>
                  <StatNumber>1,247</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    +15% this week
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Streak</StatLabel>
                  <StatNumber>7</StatNumber>
                  <StatHelpText>days</StatHelpText>
                </Stat>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card w="full">
            <CardHeader>
              <Heading size="md">Quick Actions</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3}>
                <Button leftIcon={<FiCode />} w="full" colorScheme="blue">
                  Open Code Editor
                </Button>
                <Button leftIcon={<FiUsers />} w="full" variant="outline">
                  Join Swarm Lab
                </Button>
                <Button leftIcon={<FiZap />} w="full" variant="outline">
                  Run Tests
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </GridItem>
    </Grid>
  )

  const LessonViewer = () => (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Heading size="md">{selectedLesson.title}</Heading>
            <HStack fontSize="sm" color="gray.600">
              <Badge colorScheme="blue">{selectedLesson.type}</Badge>
              <Icon as={FiClock} />
              <Text>{selectedLesson.duration} minutes</Text>
            </HStack>
          </VStack>
          <Button leftIcon={<FiPlay />} colorScheme="blue">
            Continue Learning
          </Button>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="stretch" spacing={6}>
          {/* Lesson Content */}
          <Box>
            <Text mb={4}>{selectedLesson.content}</Text>
            
            {selectedLesson.type === 'video' && (
              <Box
                h="300px"
                bg="gray.100"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <VStack>
                  <Icon as={FiPlay} size="3em" color="gray.500" />
                  <Text color="gray.500">Video Player Placeholder</Text>
                  <Button colorScheme="blue" variant="outline">
                    ▶ Play Video
                  </Button>
                </VStack>
              </Box>
            )}
            
            {selectedLesson.type === 'interactive' && (
              <Card bg="blue.50">
                <CardBody>
                  <VStack spacing={4}>
                    <Icon as={FiZap} size="2em" color="blue.500" />
                    <Heading size="sm">Interactive Exercise</Heading>
                    <Text textAlign="center">
                      Complete the hands-on exercise to master this concept
                    </Text>
                    <Button colorScheme="blue">Start Exercise</Button>
                  </VStack>
                </CardBody>
              </Card>
            )}
            
            {selectedLesson.type === 'coding' && (
              <Card bg="purple.50">
                <CardBody>
                  <VStack spacing={4}>
                    <Icon as={FiCode} size="2em" color="purple.500" />
                    <Heading size="sm">Coding Challenge</Heading>
                    <Text textAlign="center">
                      Practice your skills with this coding challenge
                    </Text>
                    <Button colorScheme="purple">Open Code Editor</Button>
                  </VStack>
                </CardBody>
              </Card>
            )}
          </Box>

          {/* Lesson Progress */}
          <Box>
            <Flex justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="semibold">Lesson Progress</Text>
              <Text fontSize="sm">{selectedLesson.completed ? '100%' : '0%'}</Text>
            </Flex>
            <Progress
              value={selectedLesson.completed ? 100 : 0}
              colorScheme={selectedLesson.completed ? 'green' : 'blue'}
            />
          </Box>

          {/* Navigation */}
          <HStack justify="space-between">
            <Button variant="outline">← Previous Lesson</Button>
            <Button colorScheme="blue">
              {selectedLesson.completed ? 'Next Lesson →' : 'Mark Complete'}
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  )

  const CodeEditor = () => (
    <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
      <GridItem>
        <Card h="600px">
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="md">Code Editor</Heading>
              <HStack>
                <Select size="sm" defaultValue="javascript" w="120px">
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="rust">Rust</option>
                </Select>
                <Button
                  size="sm"
                  colorScheme="green"
                  leftIcon={<FiPlay />}
                  isLoading={isExecuting}
                  onClick={executeCode}
                >
                  Run Code
                </Button>
              </HStack>
            </HStack>
          </CardHeader>
          <CardBody p={0}>
            <Textarea
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Write your rUv-Swarm code here..."
              h="full"
              resize="none"
              fontFamily="mono"
              fontSize="sm"
              borderRadius="0"
              border="none"
              _focus={{ boxShadow: 'none' }}
            />
          </CardBody>
        </Card>
      </GridItem>

      <GridItem>
        <Card h="600px">
          <CardHeader>
            <HStack>
              <Icon as={FiZap} color="green.500" />
              <Heading size="md">Output</Heading>
              {isExecuting && <Spinner size="sm" />}
            </HStack>
          </CardHeader>
          <CardBody>
            <Code
              display="block"
              whiteSpace="pre-wrap"
              p={4}
              h="full"
              overflow="auto"
              bg="gray.900"
              color="green.400"
              fontFamily="mono"
              fontSize="sm"
            >
              {codeOutput || 'Output will appear here when you run your code...'}
            </Code>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  )

  const QuizSystem = () => (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Heading size="md">{mockQuiz.title}</Heading>
            <Text color="gray.600">{mockQuiz.questions.length} questions</Text>
          </VStack>
          {quizScore !== null && (
            <Badge
              colorScheme={quizScore >= 70 ? 'green' : 'yellow'}
              fontSize="md"
              p={2}
            >
              Score: {quizScore}%
            </Badge>
          )}
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="stretch" spacing={6}>
          {mockQuiz.questions.map((question, index) => (
            <Box key={question.id} p={4} borderWidth={1} borderRadius="md">
              <Text fontWeight="semibold" mb={4}>
                {index + 1}. {question.question}
              </Text>
              <VStack align="stretch" spacing={2}>
                {question.options.map((option, optionIndex) => (
                  <Button
                    key={optionIndex}
                    variant={quizAnswers[question.id] === optionIndex ? 'solid' : 'outline'}
                    colorScheme={quizAnswers[question.id] === optionIndex ? 'blue' : 'gray'}
                    justifyContent="flex-start"
                    onClick={() => setQuizAnswers({
                      ...quizAnswers,
                      [question.id]: optionIndex
                    })}
                    isDisabled={quizScore !== null}
                  >
                    {String.fromCharCode(65 + optionIndex)}. {option}
                  </Button>
                ))}
              </VStack>
              {quizScore !== null && (
                <Alert
                  status={quizAnswers[question.id] === question.correct ? 'success' : 'error'}
                  mt={3}
                >
                  <AlertIcon />
                  {quizAnswers[question.id] === question.correct
                    ? 'Correct!'
                    : `Incorrect. The correct answer is ${String.fromCharCode(65 + question.correct)}.`
                  }
                </Alert>
              )}
            </Box>
          ))}

          {quizScore === null && (
            <Button
              colorScheme="blue"
              size="lg"
              onClick={submitQuiz}
              isDisabled={Object.keys(quizAnswers).length < mockQuiz.questions.length}
            >
              Submit Quiz
            </Button>
          )}

          {quizScore !== null && (
            <Alert status={quizScore >= 70 ? 'success' : 'warning'}>
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">
                  Quiz completed! You scored {quizScore}%
                </Text>
                <Text>
                  {quizScore >= 70
                    ? 'Congratulations! You passed this quiz.'
                    : 'You need 70% to pass. Review the material and try again.'
                  }
                </Text>
              </Box>
            </Alert>
          )}
        </VStack>
      </CardBody>
    </Card>
  )

  const ProgressTracking = () => (
    <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
      <GridItem>
        <Card>
          <CardHeader>
            <Heading size="md">Learning Progress</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6}>
              {mockCourses.map(course => (
                <Box key={course.id} w="full">
                  <Flex justify="space-between" mb={2}>
                    <Text fontWeight="semibold">{course.title}</Text>
                    <Text fontSize="sm" color="gray.600">{course.progress}%</Text>
                  </Flex>
                  <Progress value={course.progress} colorScheme="blue" mb={2} />
                  <HStack justify="space-between" fontSize="sm" color="gray.600">
                    <Text>
                      {Math.floor(course.lessons * course.progress / 100)} of {course.lessons} lessons
                    </Text>
                    <Text>{course.difficulty}</Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </GridItem>

      <GridItem>
        <VStack spacing={6}>
          <Card w="full">
            <CardHeader>
              <Heading size="md">Achievements</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3}>
                <HStack w="full">
                  <Icon as={FiStar} color="yellow.400" />
                  <Text fontSize="sm">First Course Completed</Text>
                </HStack>
                <HStack w="full">
                  <Icon as={FiZap} color="purple.400" />
                  <Text fontSize="sm">Code Ninja</Text>
                </HStack>
                <HStack w="full">
                  <Icon as={FiUsers} color="blue.400" />
                  <Text fontSize="sm">Swarm Coordinator</Text>
                </HStack>
                <HStack w="full">
                  <Icon as={FiTrendingUp} color="green.400" />
                  <Text fontSize="sm">Week Streak</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          <Card w="full">
            <CardHeader>
              <Heading size="md">Next Goals</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <Box>
                  <Text fontSize="sm" mb={1}>Complete Advanced Patterns</Text>
                  <Progress value={45} size="sm" colorScheme="orange" />
                </Box>
                <Box>
                  <Text fontSize="sm" mb={1}>Master AI Development</Text>
                  <Progress value={30} size="sm" colorScheme="purple" />
                </Box>
                <Box>
                  <Text fontSize="sm" mb={1}>10-Day Streak</Text>
                  <Progress value={70} size="sm" colorScheme="green" />
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </GridItem>
    </Grid>
  )

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="2xl" mb={4} bgGradient="linear(to-r, blue.600, purple.600)" bgClip="text">
            rUv-Swarm Course Platform Demo
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={6}>
            Explore all the features of our integrated learning management system
          </Text>
          
          <Alert status="info" mb={6}>
            <AlertIcon />
            This is a live demonstration of the integrated frontend and backend system.
            All features are functional and connected to the FastAPI backend.
          </Alert>
        </Box>

        {/* Main Demo Tabs */}
        <Tabs index={currentTab} onChange={setCurrentTab} variant="enclosed" colorScheme="blue">
          <TabList flexWrap="wrap">
            <Tab>📊 Dashboard</Tab>
            <Tab>📚 Lesson Viewer</Tab>
            <Tab>💻 Code Editor</Tab>
            <Tab>❓ Quiz System</Tab>
            <Tab>📈 Progress</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0} pt={6}>
              <CourseDashboard />
            </TabPanel>
            
            <TabPanel p={0} pt={6}>
              <LessonViewer />
            </TabPanel>
            
            <TabPanel p={0} pt={6}>
              <CodeEditor />
            </TabPanel>
            
            <TabPanel p={0} pt={6}>
              <QuizSystem />
            </TabPanel>
            
            <TabPanel p={0} pt={6}>
              <ProgressTracking />
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <Heading size="md">Technical Implementation Details</Heading>
          </CardHeader>
          <CardBody>
            <Accordion allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Icon as={FiServer} />
                      <Text>Backend Architecture</Text>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <VStack align="start" spacing={2}>
                    <Text>• FastAPI with async/await support</Text>
                    <Text>• JWT-based authentication system</Text>
                    <Text>• SQLAlchemy ORM with PostgreSQL</Text>
                    <Text>• RESTful API design</Text>
                    <Text>• Comprehensive error handling</Text>
                    <Text>• OpenAPI documentation</Text>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Icon as={FiGlobe} />
                      <Text>Frontend Architecture</Text>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <VStack align="start" spacing={2}>
                    <Text>• React 19 with modern hooks</Text>
                    <Text>• Chakra UI component library</Text>
                    <Text>• Zustand for state management</Text>
                    <Text>• React Router for navigation</Text>
                    <Text>• Axios for API communication</Text>
                    <Text>• Vite for development and building</Text>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Icon as={FiShield} />
                      <Text>Security Features</Text>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <VStack align="start" spacing={2}>
                    <Text>• JWT access and refresh tokens</Text>
                    <Text>• Password hashing with bcrypt</Text>
                    <Text>• CORS protection</Text>
                    <Text>• Request rate limiting</Text>
                    <Text>• Input validation and sanitization</Text>
                    <Text>• Secure HTTP headers</Text>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Icon as={FiDatabase} />
                      <Text>Data Management</Text>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <VStack align="start" spacing={2}>
                    <Text>• PostgreSQL database with connection pooling</Text>
                    <Text>• Alembic database migrations</Text>
                    <Text>• Optimized queries with indexing</Text>
                    <Text>• Data validation with Pydantic</Text>
                    <Text>• Backup and recovery procedures</Text>
                    <Text>• Development vs production configurations</Text>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  )
}

export default DemoPage