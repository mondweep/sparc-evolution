import {
  Box,
  Flex,
  Drawer,
  DrawerContent,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import Sidebar from './Sidebar'
import Header from './Header'
import useAppStore from '../../store/useAppStore'

const Layout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <Sidebar
        onClose={onClose}
        display={{ base: 'none', md: 'block' }}
        isOpen={sidebarOpen}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <Sidebar onClose={onClose} />
        </DrawerContent>
      </Drawer>
      
      <Box ml={{ base: 0, md: sidebarOpen ? 60 : 0 }} transition="margin-left 0.3s">
        <Header onOpen={onOpen} />
        
        <Box p="4">
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Layout