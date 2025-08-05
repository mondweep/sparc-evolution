import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  CardHeader,
  Button,
  Badge,
  Grid,
  Image,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { FiSearch, FiTrendingUp, FiStar, FiUsers, FiClock, FiBookmark } from 'react-icons/fi'

const ExplorePage = () => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const featuredContent = [
    {
      id: 1,
      title: 'Building Intelligent Swarms',
      description: 'Learn how to create self-organizing AI systems that can solve complex problems collaboratively.',
      type: 'Course',
      difficulty: 'Intermediate',
      duration: '6 weeks',
      rating: 4.9,
      students: 2341,
      image: null,
      category: 'AI Development'
    },
    {
      id: 2,
      title: 'Distributed Learning Algorithms',
      description: 'Master the algorithms that power distributed machine learning in swarm environments.',
      type: 'Workshop',
      difficulty: 'Advanced',
      duration: '3 days',
      rating: 4.8,
      students: 456,
      image: null,
      category: 'Machine Learning'
    },
    {
      id: 3,
      title: 'Swarm Robotics Fundamentals',
      description: 'Introduction to coordinating multiple robots using swarm intelligence principles.',
      type: 'Course',
      difficulty: 'Beginner',
      duration: '4 weeks',
      rating: 4.7,
      students: 1892,
      image: null,
      category: 'Robotics'
    }
  ]

  const trendingTopics = [
    { name: 'Neural Swarms', growth: '+234%' },
    { name: 'Collective Intelligence', growth: '+156%' },
    { name: 'Distributed AI', growth: '+98%' },
    { name: 'Multi-Agent Systems', growth: '+87%' },
    { name: 'Emergent Behavior', growth: '+76%' }
  ]

  const categories = [
    'All Categories',
    'AI Development',
    'Machine Learning',
    'Robotics',
    'Distributed Systems',
    'Neural Networks',
    'Optimization'
  ]

  return (
    <Box>
      <VStack spacing="6" align="stretch">
        <Box>
          <Heading size="xl" mb="2">Explore</Heading>
          <Text color="gray.600">
            Discover new courses, workshops, and learning paths in swarm intelligence
          </Text>
        </Box>

        {/* Search and Filters */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <VStack spacing="4" align="stretch">
              <HStack spacing="4">
                <InputGroup flex="1">
                  <InputLeftElement pointerEvents="none">
                    <FiSearch color="gray.300" />
                  </InputLeftElement>
                  <Input placeholder="Search courses, topics, or instructors..." />
                </InputGroup>
                <Select maxW="200px" placeholder="All Categories">
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
                <Select maxW="150px" placeholder="Difficulty">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Select>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Trending Topics */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <HStack>
              <FiTrendingUp />
              <Heading size="md">Trending Topics</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <HStack spacing="4" flexWrap="wrap">
              {trendingTopics.map((topic) => (
                <Badge
                  key={topic.name}
                  colorScheme="green"
                  p="2"
                  borderRadius="md"
                  cursor="pointer"
                  _hover={{ bg: 'green.100' }}
                >
                  {topic.name} {topic.growth}
                </Badge>
              ))}
            </HStack>
          </CardBody>
        </Card>

        {/* Content Tabs */}
        <Tabs>
          <TabList>
            <Tab>Featured</Tab>
            <Tab>Courses</Tab>
            <Tab>Workshops</Tab>
            <Tab>Learning Paths</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px="0">
              <Grid
                templateColumns="repeat(auto-fill, minmax(350px, 1fr))"
                gap="6"
              >
                {featuredContent.map((item) => (
                  <Card
                    key={item.id}
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    shadow="sm"
                    _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                    cursor="pointer"
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        h="200px"
                        w="full"
                        objectFit="cover"
                        borderTopRadius="md"
                      />
                    )}
                    
                    <CardHeader>
                      <VStack align="start" spacing="2">
                        <HStack justify="space-between" w="full">
                          <Badge colorScheme="blue">{item.type}</Badge>
                          <HStack>
                            <Button size="xs" variant="ghost">
                              <FiBookmark />
                            </Button>
                          </HStack>
                        </HStack>
                        
                        <Heading size="md">{item.title}</Heading>
                        
                        <Text fontSize="sm" color="gray.600">
                          {item.description}
                        </Text>
                        
                        <Badge colorScheme="purple" variant="outline">
                          {item.category}
                        </Badge>
                      </VStack>
                    </CardHeader>

                    <CardBody pt="0">
                      <VStack spacing="4" align="stretch">
                        <HStack justify="space-between">
                          <Badge
                            colorScheme={
                              item.difficulty === 'Beginner' ? 'green' :
                              item.difficulty === 'Intermediate' ? 'yellow' : 'red'
                            }
                          >
                            {item.difficulty}
                          </Badge>
                          <HStack fontSize="sm" color="gray.600">
                            <FiClock />
                            <Text>{item.duration}</Text>
                          </HStack>
                        </HStack>

                        <HStack justify="space-between" fontSize="sm">
                          <HStack>
                            <FiStar color="gold" />
                            <Text>{item.rating}</Text>
                          </HStack>
                          <HStack>
                            <FiUsers />
                            <Text>{item.students.toLocaleString()} students</Text>
                          </HStack>
                        </HStack>

                        <Button colorScheme="blue" w="full">
                          Enroll Now
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </TabPanel>

            <TabPanel px="0">
              <Box textAlign="center" py="20">
                <Text fontSize="lg" color="gray.500">
                  Course catalog coming soon...
                </Text>
              </Box>
            </TabPanel>

            <TabPanel px="0">
              <Box textAlign="center" py="20">
                <Text fontSize="lg" color="gray.500">
                  Workshop directory coming soon...
                </Text>
              </Box>
            </TabPanel>

            <TabPanel px="0">
              <Box textAlign="center" py="20">
                <Text fontSize="lg" color="gray.500">
                  Learning paths coming soon...
                </Text>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  )
}

export default ExplorePage