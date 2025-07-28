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
  Progress,
  Grid,
  GridItem,
  Avatar,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiUsers, FiActivity, FiZap, FiTrendingUp } from 'react-icons/fi'

const SwarmLabPage = () => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const activeSwarms = [
    {
      id: 1,
      name: 'AI Development Swarm',
      participants: 12,
      activity: 'High',
      progress: 75,
      topic: 'Neural Networks',
      lastActive: '2 minutes ago'
    },
    {
      id: 2,
      name: 'Beginner Learning Group',
      participants: 8,
      activity: 'Medium',
      progress: 45,
      topic: 'Swarm Basics',
      lastActive: '5 minutes ago'
    },
    {
      id: 3,
      name: 'Advanced Patterns Study',
      participants: 6,
      activity: 'Low',
      progress: 30,
      topic: 'Distributed Systems',
      lastActive: '15 minutes ago'
    }
  ]

  return (
    <Box>
      <VStack spacing="6" align="stretch">
        <Box>
          <Heading size="xl" mb="2">Swarm Lab</Heading>
          <Text color="gray.600">
            Collaborate with other learners in real-time swarm intelligence environments
          </Text>
        </Box>

        {/* Stats Grid */}
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap="6">
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Active Swarms</StatLabel>
                <StatNumber>23</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  +12% from yesterday
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Online Users</StatLabel>
                <StatNumber>156</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  Peak activity
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Your Sessions</StatLabel>
                <StatNumber>8</StatNumber>
                <StatHelpText>This week</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Collaboration Score</StatLabel>
                <StatNumber>92</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  Excellent
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        {/* Active Swarms */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Active Swarms</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing="4" align="stretch">
              {activeSwarms.map((swarm) => (
                <Box
                  key={swarm.id}
                  p="4"
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor={borderColor}
                >
                  <Grid templateColumns="1fr auto" gap="4" alignItems="center">
                    <GridItem>
                      <VStack align="start" spacing="2">
                        <HStack>
                          <Heading size="sm">{swarm.name}</Heading>
                          <Badge
                            colorScheme={
                              swarm.activity === 'High' ? 'green' :
                              swarm.activity === 'Medium' ? 'yellow' : 'gray'
                            }
                          >
                            {swarm.activity} Activity
                          </Badge>
                        </HStack>
                        
                        <HStack spacing="4" fontSize="sm" color="gray.600">
                          <HStack>
                            <FiUsers />
                            <Text>{swarm.participants} participants</Text>
                          </HStack>
                          <Text>•</Text>
                          <Text>Topic: {swarm.topic}</Text>
                          <Text>•</Text>
                          <Text>Last active: {swarm.lastActive}</Text>
                        </HStack>

                        <Box w="full">
                          <HStack justify="space-between" mb="1">
                            <Text fontSize="sm">Progress</Text>
                            <Text fontSize="sm">{swarm.progress}%</Text>
                          </HStack>
                          <Progress
                            value={swarm.progress}
                            colorScheme="blue"
                            size="sm"
                          />
                        </Box>
                      </VStack>
                    </GridItem>
                    
                    <GridItem>
                      <Button colorScheme="blue" size="sm">
                        Join Swarm
                      </Button>
                    </GridItem>
                  </Grid>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="6">
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Create New Swarm</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing="4" align="stretch">
                <Text color="gray.600">
                  Start a new collaborative learning session
                </Text>
                <Button colorScheme="green" leftIcon={<FiZap />}>
                  Create Swarm
                </Button>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Recent Activity</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing="3" align="stretch">
                <HStack>
                  <Avatar size="sm" name="Sarah Chen" />
                  <VStack align="start" spacing="0" flex="1">
                    <Text fontSize="sm" fontWeight="medium">
                      Sarah completed Neural Networks Lab
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      2 minutes ago
                    </Text>
                  </VStack>
                </HStack>

                <HStack>
                  <Avatar size="sm" name="Mike Rodriguez" />
                  <VStack align="start" spacing="0" flex="1">
                    <Text fontSize="sm" fontWeight="medium">
                      Mike joined Beginner Learning Group
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      5 minutes ago
                    </Text>
                  </VStack>
                </HStack>

                <HStack>
                  <Avatar size="sm" name="Emma Thompson" />
                  <VStack align="start" spacing="0" flex="1">
                    <Text fontSize="sm" fontWeight="medium">
                      Emma created Advanced Patterns Study
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      15 minutes ago
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </Grid>
      </VStack>
    </Box>
  )
}

export default SwarmLabPage