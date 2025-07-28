import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Progress,
  VStack,
  HStack,
  Badge,
  Card,
  CardBody,
  Divider,
  IconButton,
  useColorModeValue,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react'
import {
  FiPlay,
  FiPause,
  FiSkipForward,
  FiSkipBack,
  FiBookmark,
  FiShare,
  FiDownload,
  FiFileText,
} from 'react-icons/fi'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAppStore from '../../store/useAppStore'
import { coursesAPI, exportAPI } from '../../services/api'
import { handleExportDownload, createExportFilename } from '../../utils/download'

const LessonViewer = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [lesson, setLesson] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  
  const {
    currentCourse,
    lessons,
    progress,
    updateProgress,
    setCurrentLesson,
    setLoading,
    setError,
  } = useAppStore()

  const bgColor = 'white'
  const borderColor = 'gray.200'

  // Load lesson data
  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true)
        const response = await coursesAPI.getLesson(courseId, lessonId)
        setLesson(response.data)
        setCurrentLesson(response.data)
        setDuration(response.data.duration || 0)
      } catch (error) {
        setError('Failed to load lesson')
        console.error('Error loading lesson:', error)
      } finally {
        setLoading(false)
      }
    }

    if (courseId && lessonId) {
      loadLesson()
    }
  }, [courseId, lessonId, setLoading, setError, setCurrentLesson])

  // Get current lesson progress
  const lessonProgress = progress[lessonId] || { completed: false, progress: 0 }
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  // Handle play/pause
  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  // Handle progress update
  const handleProgressUpdate = (newProgress) => {
    updateProgress(lessonId, {
      ...lessonProgress,
      progress: newProgress,
      lastAccessed: new Date().toISOString(),
    })
  }

  // Navigate to next/previous lesson
  const navigateLesson = (direction) => {
    const currentIndex = lessons.findIndex(l => l.id === parseInt(lessonId))
    let nextIndex
    
    if (direction === 'next') {
      nextIndex = currentIndex + 1
    } else {
      nextIndex = currentIndex - 1
    }
    
    if (nextIndex >= 0 && nextIndex < lessons.length) {
      const nextLesson = lessons[nextIndex]
      navigate(`/courses/${courseId}/lessons/${nextLesson.id}`)
    }
  }

  // Mark lesson as complete
  const markComplete = () => {
    updateProgress(lessonId, {
      ...lessonProgress,
      completed: true,
      progress: 100,
      completedAt: new Date().toISOString(),
    })
  }

  // Handle lesson export to markdown
  const handleExportLesson = async () => {
    setIsExporting(true)
    
    const filename = createExportFilename(
      `lesson_${lessonId}_${lesson?.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'lesson'}`,
      '.md'
    )
    
    await handleExportDownload(
      exportAPI.exportLessonMarkdown(lessonId),
      filename,
      (downloadedFilename) => {
        toast({
          title: 'Export Successful',
          description: `Lesson exported as ${downloadedFilename}`,
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
    
    setIsExporting(false)
  }

  if (!lesson) {
    return (
      <Box textAlign="center" py="10">
        <Text>Loading lesson...</Text>
      </Box>
    )
  }

  return (
    <Box maxW="4xl" mx="auto">
      {/* Lesson Header */}
      <VStack spacing="4" align="stretch" mb="8">
        <HStack justify="space-between">
          <VStack align="start" spacing="2">
            <Badge colorScheme="blue">{lesson.type}</Badge>
            <Heading size="lg">{lesson.title}</Heading>
            <Text color="gray.600">{lesson.description}</Text>
          </VStack>
          
          <HStack>
            <IconButton
              icon={<FiBookmark />}
              variant="ghost"
              aria-label="Bookmark lesson"
            />
            <IconButton
              icon={<FiShare />}
              variant="ghost"
              aria-label="Share lesson"
            />
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiDownload />}
                variant="ghost"
                aria-label="Export lesson"
                isLoading={isExporting}
              />
              <MenuList>
                <MenuItem 
                  icon={<FiFileText />} 
                  onClick={handleExportLesson}
                  isDisabled={isExporting}
                >
                  Export to Markdown
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </HStack>

        {/* Progress Bar */}
        <Box>
          <Flex justify="space-between" mb="2">
            <Text fontSize="sm">Progress</Text>
            <Text fontSize="sm">{Math.round(progressPercentage)}%</Text>
          </Flex>
          <Progress value={progressPercentage} colorScheme="blue" />
        </Box>
      </VStack>

      {/* Main Content */}
      <Card mb="6">
        <CardBody>
          {lesson.type === 'video' ? (
            <VStack spacing="4">
              {/* Video Player Placeholder */}
              <Box
                w="full"
                h="400px"
                bg="black"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
              >
                <Text color="white" fontSize="lg">
                  Video Player ({lesson.videoUrl})
                </Text>
                
                {/* Play/Pause Overlay */}
                <IconButton
                  icon={isPlaying ? <FiPause /> : <FiPlay />}
                  size="lg"
                  colorScheme="blue"
                  borderRadius="full"
                  position="absolute"
                  onClick={togglePlayback}
                />
              </Box>

              {/* Video Controls */}
              <HStack w="full" spacing="4">
                <IconButton
                  icon={<FiSkipBack />}
                  variant="ghost"
                  onClick={() => navigateLesson('prev')}
                  aria-label="Previous lesson"
                />
                <IconButton
                  icon={isPlaying ? <FiPause /> : <FiPlay />}
                  colorScheme="blue"
                  onClick={togglePlayback}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                />
                <IconButton
                  icon={<FiSkipForward />}
                  variant="ghost"
                  onClick={() => navigateLesson('next')}
                  aria-label="Next lesson"
                />
                
                <Box flex="1">
                  <Progress value={progressPercentage} size="sm" />
                </Box>
                
                <Text fontSize="sm">
                  {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} /
                  {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                </Text>
              </HStack>
            </VStack>
          ) : (
            // Text/Reading Content
            <VStack spacing="6" align="stretch">
              <Box
                dangerouslySetInnerHTML={{ __html: lesson.content }}
                lineHeight="1.8"
                fontSize="lg"
              />
              
              {lesson.codeExample && (
                <Box>
                  <Text fontWeight="semibold" mb="3">Code Example:</Text>
                  <Box
                    bg="gray.50"
                    p="4"
                    borderRadius="md"
                    borderWidth="1px"
                    overflowX="auto"
                  >
                    <pre>
                      <code>{lesson.codeExample}</code>
                    </pre>
                  </Box>
                </Box>
              )}
            </VStack>
          )}
        </CardBody>
      </Card>

      {/* Lesson Actions */}
      <Card>
        <CardBody>
          <Flex justify="space-between" align="center">
            <HStack>
              <Button
                variant="outline"
                onClick={() => navigateLesson('prev')}
                disabled={lessons.findIndex(l => l.id === parseInt(lessonId)) === 0}
              >
                Previous Lesson
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigateLesson('next')}
                disabled={lessons.findIndex(l => l.id === parseInt(lessonId)) === lessons.length - 1}
              >
                Next Lesson
              </Button>
            </HStack>
            
            <HStack>
              {lesson.hasQuiz && (
                <Button
                  colorScheme="purple"
                  onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}/quiz`)}
                >
                  Take Quiz
                </Button>
              )}
              
              <Button
                colorScheme="green"
                onClick={markComplete}
                disabled={lessonProgress.completed}
              >
                {lessonProgress.completed ? 'Completed ✓' : 'Mark Complete'}
              </Button>
            </HStack>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  )
}

export default LessonViewer