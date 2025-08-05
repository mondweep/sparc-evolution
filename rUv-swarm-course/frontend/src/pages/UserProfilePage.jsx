import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Badge,
  Button,
  Avatar,
  Flex,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  SimpleGrid,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'
import {
  FiUser,
  FiDownload,
  FiFileText,
  FiBarChart3,
  FiAward,
  FiBook,
  FiClock,
  FiTrendingUp,
} from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { exportAPI } from '../services/api'
import { handleExportDownload, createExportFilename } from '../utils/download'
import useAppStore from '../store/useAppStore'

const UserProfilePage = () => {
  const toast = useToast()
  const { user } = useAppStore()
  const [isExporting, setIsExporting] = useState(false)
  const [progressData, setProgressData] = useState(null)
  
  // Mock user progress data - in real implementation, fetch from API
  useEffect(() => {
    const mockProgressData = {
      user: {
        name: `${user?.first_name || 'John'} ${user?.last_name || 'Doe'}`,
        email: user?.email || 'john.doe@example.com',
        joinDate: '2024-01-15',
        avatar: user?.avatar || null
      },
      stats: {
        coursesEnrolled: 4,
        coursesCompleted: 2,
        lessonsCompleted: 28,
        totalLessons: 35,
        quizzesPassed: 12,
        totalQuizzes: 15,
        studyTimeHours: 21,
        averageScore: 87.3,
        currentStreak: 7
      },
      courses: [
        {
          id: 1,
          title: 'rUv-Swarm Foundations',
          level: 'Foundations',
          progress: 100,
          status: 'completed',
          completedAt: '2024-02-01',
          lessonsCompleted: 8,
          totalLessons: 8
        },
        {
          id: 2,
          title: 'Advanced Swarm Patterns',
          level: 'Practitioner',
          progress: 75,
          status: 'in_progress',
          lessonsCompleted: 9,
          totalLessons: 12
        },
        {
          id: 3,
          title: 'Swarm Architecture Design',
          level: 'Architect',
          progress: 25,
          status: 'in_progress',
          lessonsCompleted: 3,
          totalLessons: 10
        }
      ],
      achievements: [
        { name: 'First Steps', description: 'Completed your first lesson', earnedAt: '2024-01-16' },
        { name: 'Quiz Master', description: 'Passed 5 quizzes in a row', earnedAt: '2024-01-25' },
        { name: 'Course Completer', description: 'Finished your first course', earnedAt: '2024-02-01' },
        { name: 'Dedicated Learner', description: '7-day learning streak', earnedAt: '2024-02-10' }
      ],
      recentActivity: [
        { type: 'lesson_completed', title: 'Advanced Coordination Patterns', date: '2024-02-15', course: 'Advanced Swarm Patterns' },
        { type: 'quiz_passed', title: 'Coordination Quiz', score: 90, date: '2024-02-14', course: 'Advanced Swarm Patterns' },
        { type: 'lesson_completed', title: 'Error Handling Strategies', date: '2024-02-13', course: 'Advanced Swarm Patterns' }
      ]
    }
    setProgressData(mockProgressData)
  }, [user])

  // Handle progress export in different formats
  const handleExportProgress = async (format) => {
    setIsExporting(true)
    
    try {
      let exportPromise
      let filename
      
      switch (format) {
        case 'json':
          exportPromise = exportAPI.exportProgressJSON({
            include_courses: true,
            include_achievements: true,
            include_activity: true
          })
          filename = createExportFilename('progress_report', '.json')
          break
          
        case 'csv':
          exportPromise = exportAPI.exportProgressCSV()
          filename = createExportFilename('progress_summary', '.csv')
          break
          
        default:
          throw new Error('Unsupported format')
      }
      
      await handleExportDownload(
        exportPromise,
        filename,
        (downloadedFilename) => {
          toast({
            title: 'Export Successful',
            description: `Progress report exported as ${downloadedFilename}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        },
        (error) => {
          toast({
            title: 'Export Failed',
            description: error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
      )
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
    
    setIsExporting(false)
  }

  // Handle course completion certificate generation
  const handleGenerateCertificate = async (courseId, courseTitle) => {
    const filename = createExportFilename(`certificate_${courseTitle.replace(/[^a-zA-Z0-9]/g, '_')}`, '.pdf')
    
    await handleExportDownload(
      exportAPI.generateCompletionCertificate(courseId),
      filename,
      (downloadedFilename) => {
        toast({
          title: 'Certificate Generated',
          description: `Your certificate has been saved as ${downloadedFilename}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      },
      (error) => {
        toast({
          title: 'Certificate Generation Failed',
          description: error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    )
  }

  if (!progressData) {
    return (
      <Container maxW="6xl" py="8">
        <Text>Loading profile...</Text>
      </Container>
    )
  }

  return (
    <Container maxW="6xl" py="8">
      {/* Profile Header */}
      <Card mb="8">
        <CardBody>
          <Flex align="center" justify="space-between">
            <HStack spacing="6">
              <Avatar 
                size="xl" 
                name={progressData.user.name}
                src={progressData.user.avatar}
              />
              <VStack align="start" spacing="2">
                <Heading size="lg">{progressData.user.name}</Heading>
                <Text color="gray.600">{progressData.user.email}</Text>
                <Badge colorScheme="blue">Member since {progressData.user.joinDate}</Badge>
              </VStack>
            </HStack>
            
            <Menu>
              <MenuButton
                as={Button}
                leftIcon={<FiDownload />}
                colorScheme="blue"
                variant="outline"
                isLoading={isExporting}
              >
                Export Progress
              </MenuButton>
              <MenuList>
                <MenuItem 
                  icon={<FiFileText />}
                  onClick={() => handleExportProgress('json')}
                >
                  Detailed Report (JSON)
                </MenuItem>
                <MenuItem 
                  icon={<FiBarChart3 />}
                  onClick={() => handleExportProgress('csv')}
                >
                  Summary (CSV)
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </CardBody>
      </Card>

      {/* Statistics Grid */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="6" mb="8">
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiBook} />
                  <Text>Courses Completed</Text>
                </HStack>
              </StatLabel>
              <StatNumber>{progressData.stats.coursesCompleted}</StatNumber>
              <StatHelpText>
                of {progressData.stats.coursesEnrolled} enrolled
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiAward} />
                  <Text>Quiz Average</Text>
                </HStack>
              </StatLabel>
              <StatNumber>{progressData.stats.averageScore}%</StatNumber>
              <StatHelpText>
                {progressData.stats.quizzesPassed}/{progressData.stats.totalQuizzes} passed
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiClock} />
                  <Text>Study Time</Text>
                </HStack>
              </StatLabel>
              <StatNumber>{progressData.stats.studyTimeHours}h</StatNumber>
              <StatHelpText>
                {progressData.stats.lessonsCompleted}/{progressData.stats.totalLessons} lessons
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiTrendingUp} />
                  <Text>Learning Streak</Text>
                </HStack>
              </StatLabel>
              <StatNumber>{progressData.stats.currentStreak}</StatNumber>
              <StatHelpText>days in a row</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="8">
        {/* Course Progress */}
        <Card>
          <CardHeader>
            <Heading size="md">Course Progress</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing="4" align="stretch">
              {progressData.courses.map((course) => (
                <Box key={course.id}>
                  <Flex justify="space-between" align="center" mb="2">
                    <VStack align="start" spacing="1" flex="1">
                      <Text fontWeight="semibold">{course.title}</Text>
                      <HStack>
                        <Badge size="sm" colorScheme="purple">{course.level}</Badge>
                        <Badge 
                          size="sm" 
                          colorScheme={course.status === 'completed' ? 'green' : 'orange'}
                        >
                          {course.status === 'completed' ? 'Completed' : 'In Progress'}
                        </Badge>
                      </HStack>
                    </VStack>
                    
                    {course.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="green"
                        leftIcon={<FiDownload />}
                        onClick={() => handleGenerateCertificate(course.id, course.title)}
                      >
                        Certificate
                      </Button>
                    )}
                  </Flex>
                  
                  <Progress 
                    value={course.progress} 
                    colorScheme={course.status === 'completed' ? 'green' : 'blue'}
                    size="sm"
                    mb="1"
                  />
                  <Text fontSize="sm" color="gray.600">
                    {course.lessonsCompleted}/{course.totalLessons} lessons • {course.progress}%
                  </Text>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <Heading size="md">Achievements</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing="3" align="stretch">
              {progressData.achievements.map((achievement, index) => (
                <HStack key={index} spacing="3">
                  <Icon as={FiAward} color="yellow.500" boxSize="5" />
                  <VStack align="start" spacing="0" flex="1">
                    <Text fontWeight="semibold">{achievement.name}</Text>
                    <Text fontSize="sm" color="gray.600">{achievement.description}</Text>
                    <Text fontSize="xs" color="gray.500">Earned on {achievement.earnedAt}</Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Recent Activity */}
      <Card mt="8">
        <CardHeader>
          <Heading size="md">Recent Activity</Heading>
        </CardHeader>
        <CardBody>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Activity</Th>
                  <Th>Course</Th>
                  <Th>Date</Th>
                  <Th>Score</Th>
                </Tr>
              </Thead>
              <Tbody>
                {progressData.recentActivity.map((activity, index) => (
                  <Tr key={index}>
                    <Td>
                      <VStack align="start" spacing="0">
                        <Text fontWeight="medium">{activity.title}</Text>
                        <Badge size="sm" colorScheme={activity.type === 'lesson_completed' ? 'blue' : 'green'}>
                          {activity.type === 'lesson_completed' ? 'Lesson' : 'Quiz'}
                        </Badge>
                      </VStack>
                    </Td>
                    <Td>{activity.course}</Td>
                    <Td>{activity.date}</Td>
                    <Td>{activity.score ? `${activity.score}%` : '-'}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
    </Container>
  )
}

export default UserProfilePage