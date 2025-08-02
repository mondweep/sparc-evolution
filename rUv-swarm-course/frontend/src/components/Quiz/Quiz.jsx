import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  HStack,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Button,
  Progress,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  useToast,
  IconButton,
} from '@chakra-ui/react'
import { FiDownload } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { quizAPI, exportAPI } from '../../services/api'
import useAppStore from '../../store/useAppStore'
import { handleExportDownload, createExportFilename } from '../../utils/download'

const Quiz = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExportingCertificate, setIsExportingCertificate] = useState(false)
  
  const { setLoading, setError, updateProgress } = useAppStore()

  // Load quiz data
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true)
        const response = await quizAPI.get(lessonId)
        setQuiz(response.data)
        
        // Initialize timer if quiz has time limit
        if (response.data.timeLimit) {
          setTimeLeft(response.data.timeLimit * 60) // Convert minutes to seconds
        }
        
        // Initialize answers object
        const initialAnswers = {}
        response.data.questions.forEach((_, index) => {
          initialAnswers[index] = null
        })
        setAnswers(initialAnswers)
        
      } catch (error) {
        setError('Failed to load quiz')
        console.error('Error loading quiz:', error)
      } finally {
        setLoading(false)
      }
    }

    if (lessonId) {
      loadQuiz()
    }
  }, [lessonId, setLoading, setError])

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResults) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, showResults])

  // Handle answer change
  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  // Navigate to next/previous question
  const navigateQuestion = (direction) => {
    if (direction === 'next' && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else if (direction === 'prev' && currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  // Submit quiz
  const handleSubmitQuiz = async () => {
    // Check if all questions are answered
    const unansweredQuestions = Object.values(answers).filter(answer => 
      answer === null || answer === undefined || 
      (Array.isArray(answer) && answer.length === 0)
    ).length

    if (unansweredQuestions > 0) {
      toast({
        title: 'Incomplete Quiz',
        description: `Please answer all questions. ${unansweredQuestions} questions remaining.`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await quizAPI.submit(lessonId, answers)
      setResults(response.data)
      setShowResults(true)
      
      // Update lesson progress
      updateProgress(lessonId, {
        quizCompleted: true,
        quizScore: response.data.score,
        quizAttempts: (quiz.attempts || 0) + 1,
        completedAt: new Date().toISOString(),
      })
      
      toast({
        title: 'Quiz Submitted!',
        description: `You scored ${response.data.score}/${response.data.totalPoints} points`,
        status: response.data.passed ? 'success' : 'info',
        duration: 5000,
        isClosable: true,
      })
      
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit quiz. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      console.error('Error submitting quiz:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Handle certificate export
  const handleExportCertificate = async () => {
    if (!results || !results.passed) return
    
    setIsExportingCertificate(true)
    
    // Mock quiz attempt ID - in real implementation, get from results
    const quizAttemptId = results.attemptId || 1
    
    const filename = createExportFilename(
      `quiz_certificate_${lessonId}`,
      '.pdf'
    )
    
    await handleExportDownload(
      exportAPI.exportQuizCertificate(quizAttemptId),
      filename,
      (downloadedFilename) => {
        toast({
          title: 'Certificate Downloaded',
          description: `Your certificate has been saved as ${downloadedFilename}`,
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
    
    setIsExportingCertificate(false)
  }

  if (!quiz) {
    return (
      <Box textAlign="center" py="10">
        <Text>Loading quiz...</Text>
      </Box>
    )
  }

  if (showResults && results) {
    return (
      <Box maxW="2xl" mx="auto">
        <Card>
          <CardHeader>
            <Flex justify="space-between" align="start">
              <VStack spacing="4" align="center" flex="1">
                <Heading size="lg">Quiz Results</Heading>
                <Badge
                  colorScheme={results.passed ? 'green' : 'red'}
                  fontSize="lg"
                  p="2"
                  borderRadius="md"
                >
                  {results.passed ? 'PASSED' : 'FAILED'}
                </Badge>
              </VStack>
              
              {results.passed && (
                <IconButton
                  icon={<FiDownload />}
                  variant="outline"
                  colorScheme="green"
                  aria-label="Download certificate"
                  onClick={handleExportCertificate}
                  isLoading={isExportingCertificate}
                  size="sm"
                />
              )}
            </Flex>
          </CardHeader>
          
          <CardBody>
            <VStack spacing="6">
              <Box textAlign="center">
                <Text fontSize="3xl" fontWeight="bold">
                  {results.score} / {results.totalPoints}
                </Text>
                <Text color="gray.600">
                  {Math.round((results.score / results.totalPoints) * 100)}% Score
                </Text>
              </Box>
              
              <Progress
                value={(results.score / results.totalPoints) * 100}
                colorScheme={results.passed ? 'green' : 'red'}
                size="lg"
                w="full"
              />
              
              <Alert
                status={results.passed ? 'success' : 'error'}
                borderRadius="md"
              >
                <AlertIcon />
                <Box>
                  <AlertTitle>
                    {results.passed ? 'Congratulations!' : 'Keep Learning!'}
                  </AlertTitle>
                  <AlertDescription>
                    {results.passed
                      ? 'You have successfully completed this quiz.'
                      : `You need ${quiz.passingScore || 70}% to pass. Review the lesson and try again.`
                    }
                  </AlertDescription>
                </Box>
              </Alert>
              
              <HStack spacing="4" w="full">
                <Button
                  flex="1"
                  onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}`)}
                >
                  Back to Lesson
                </Button>
                
                {!results.passed && (
                  <Button
                    flex="1"
                    colorScheme="blue"
                    onClick={() => {
                      setShowResults(false)
                      setCurrentQuestion(0)
                      setAnswers({})
                      if (quiz.timeLimit) {
                        setTimeLeft(quiz.timeLimit * 60)
                      }
                    }}
                  >
                    Retry Quiz
                  </Button>
                )}
                
                {results.passed && (
                  <Button
                    flex="1"
                    colorScheme="green"
                    onClick={() => navigate(`/courses/${courseId}`)}
                  >
                    Continue Course
                  </Button>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <Box maxW="4xl" mx="auto">
      {/* Quiz Header */}
      <Card mb="6">
        <CardHeader>
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing="2">
              <Heading size="lg">{quiz.title}</Heading>
              <Text color="gray.600">{quiz.description}</Text>
            </VStack>
            
            {timeLeft !== null && (
              <VStack align="end" spacing="1">
                <Text fontSize="sm" color="gray.600">Time Remaining</Text>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color={timeLeft < 300 ? 'red.500' : 'blue.500'}
                >
                  {formatTime(timeLeft)}
                </Text>
              </VStack>
            )}
          </Flex>
          
          <Box mt="4">
            <Flex justify="space-between" mb="2">
              <Text fontSize="sm">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </Text>
              <Text fontSize="sm">{Math.round(progress)}% Complete</Text>
            </Flex>
            <Progress value={progress} colorScheme="blue" />
          </Box>
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card mb="6">
        <CardBody>
          <VStack spacing="6" align="stretch">
            <Box>
              <Flex justify="space-between" align="start" mb="4">
                <Heading size="md" flex="1">
                  {question.question}
                </Heading>
                <Badge colorScheme="blue">
                  {question.points} {question.points === 1 ? 'point' : 'points'}
                </Badge>
              </Flex>
              
              {question.type === 'multiple-choice' && (
                <RadioGroup
                  value={answers[currentQuestion] || ''}
                  onChange={(value) => handleAnswerChange(currentQuestion, value)}
                >
                  <VStack spacing="3" align="stretch">
                    {question.options.map((option, index) => (
                      <Radio key={index} value={index.toString()}>
                        {option}
                      </Radio>
                    ))}
                  </VStack>
                </RadioGroup>
              )}
              
              {question.type === 'multiple-select' && (
                <CheckboxGroup
                  value={answers[currentQuestion] || []}
                  onChange={(value) => handleAnswerChange(currentQuestion, value)}
                >
                  <VStack spacing="3" align="stretch">
                    {question.options.map((option, index) => (
                      <Checkbox key={index} value={index.toString()}>
                        {option}
                      </Checkbox>
                    ))}
                  </VStack>
                </CheckboxGroup>
              )}
              
              {question.type === 'true-false' && (
                <RadioGroup
                  value={answers[currentQuestion] || ''}
                  onChange={(value) => handleAnswerChange(currentQuestion, value)}
                >
                  <HStack spacing="8">
                    <Radio value="true">True</Radio>
                    <Radio value="false">False</Radio>
                  </HStack>
                </RadioGroup>
              )}
            </Box>
            
            {question.explanation && (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">{question.explanation}</Text>
              </Alert>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Navigation */}
      <Card>
        <CardBody>
          <Flex justify="space-between" align="center">
            <Button
              variant="outline"
              onClick={() => navigateQuestion('prev')}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            <HStack spacing="2">
              {quiz.questions.map((_, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={index === currentQuestion ? 'solid' : 'outline'}
                  colorScheme={answers[index] !== null && answers[index] !== undefined ? 'green' : 'gray'}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </HStack>
            
            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                colorScheme="green"
                onClick={handleSubmitQuiz}
                isLoading={isSubmitting}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                colorScheme="blue"
                onClick={() => navigateQuestion('next')}
              >
                Next
              </Button>
            )}
          </Flex>
        </CardBody>
      </Card>
    </Box>
  )
}

export default Quiz