import {
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  VStack,
  HStack,
  Progress,
} from '@chakra-ui/react'
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiBook,
  FiPlay,
  FiCode,
  FiUsers,
  FiActivity,
} from 'react-icons/fi'
import { NavLink } from 'react-router-dom'
import useAppStore from '../../store/useAppStore'

const LinkItems = [
  { name: 'Dashboard', icon: FiHome, path: '/' },
  { name: 'Courses', icon: FiBook, path: '/courses' },
  { name: 'Lessons', icon: FiPlay, path: '/lessons' },
  { name: 'Code Editor', icon: FiCode, path: '/editor' },
  { name: 'Swarm Lab', icon: FiUsers, path: '/swarm' },
  { name: 'Progress', icon: FiTrendingUp, path: '/progress' },
  { name: 'Explore', icon: FiCompass, path: '/explore' },
  { name: 'Favorites', icon: FiStar, path: '/favorites' },
  { name: 'Settings', icon: FiSettings, path: '/settings' },
]

const Sidebar = ({ onClose, display, isOpen, ...rest }) => {
  const currentCourse = useAppStore((state) => state.currentCourse)
  const progress = useAppStore((state) => state.progress)
  
  // Calculate overall progress
  const totalLessons = currentCourse?.lessons?.length || 0
  const completedLessons = Object.values(progress).filter(p => p.completed).length
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: isOpen ? 60 : 0 }}
      pos="fixed"
      h="full"
      overflow="hidden"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          rUv Swarm
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      
      {/* Course Progress */}
      {currentCourse && (
        <Box mx="8" mb="6">
          <Text fontSize="sm" fontWeight="semibold" mb="2">
            {currentCourse.title}
          </Text>
          <Progress value={progressPercentage} colorScheme="blue" size="sm" />
          <Text fontSize="xs" color="gray.500" mt="1">
            {completedLessons} of {totalLessons} lessons completed
          </Text>
        </Box>
      )}
      
      <VStack spacing="1" align="stretch">
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} path={link.path}>
            {link.name}
          </NavItem>
        ))}
      </VStack>
    </Box>
  )
}

const NavItem = ({ icon, children, path, ...rest }) => {
  return (
    <Box
      as={NavLink}
      to={path}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      {({ isActive }) => (
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={isActive ? 'blue.400' : 'transparent'}
          color={isActive ? 'white' : 'inherit'}
          _hover={{
            bg: isActive ? 'blue.400' : 'blue.50',
            color: isActive ? 'white' : 'blue.600',
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: isActive ? 'white' : 'blue.600',
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      )}
    </Box>
  )
}

export default Sidebar