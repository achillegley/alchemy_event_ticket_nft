import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
//import { Link } from "@reach/router";
import { Link as ReachLink } from "react-router-dom"; 
import { useWeb3 } from '../contexts/Web3Context';
//import { Link } from "react-router-dom"; 


import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { ColorModeSwitcher } from "../components/utils/ColorModeSwitcher";


const Links = [{
        name:'Create Event',
        link:'/create-event'
    },
    {
      name:'My Events',
      link:'/my-events'
    },
    {
        name:'Buy Ticket',
        link:'/buy-ticket'
    },
    {
      name:'My Tickets',
      link:'/my-tickets'
    },
    {
      name:'Check Tickets',
      link:'/check-tickets'
    }
];

const NavLink = ({ children }: { children: {link:string, name:string} }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    as={ReachLink}
    to={children.link}>
    {children.name}
  </Link>
);

export default  function Simple() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const address= (useWeb3()).account;
  //const balance= await(useWeb3())._provider?.getBalance(address!);

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link.name} >{link}</NavLink>
              ))}
             
            </HStack>
          </HStack>
         
              <Flex alignItems={'center'}>
                <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem>Account: {address}</MenuItem>
                  {/* <MenuItem>Balance: {balance }</MenuItem> */}
                  
                </MenuList>
              </Menu>
                <ColorModeSwitcher justifySelf="flex-end" />
              </Flex>
            </Flex>
       
        

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.name}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}