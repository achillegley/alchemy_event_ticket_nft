import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { useControllableProp, useControllableState } from '@chakra-ui/react'
  import DatePicker from 'react-datepicker';
  import 'react-datepicker/dist/react-datepicker.css';



  export default function AddEvent() {
    const [selectedDateTime, setSelectedDateTime] = useControllableState<Date|null>({ defaultValue: null });
    const handleDateTimeChange = (date: Date) => {
        setSelectedDateTime(date);
      };
    
    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Create NFT</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              Fill in your event Informations ✌️
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <FormControl id="_label">
                <FormLabel>Event Title</FormLabel>
                <Input type="text" />
              </FormControl>
              <FormControl id="_date">
                <FormLabel>Date and time</FormLabel>
                <DatePicker
                    id="datetime"
                    selected={selectedDateTime}
                    onChange={handleDateTimeChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy h:mm aa"
                    placeholderText="Select date and time"
                />
              </FormControl>
              <FormControl id="_place">
                <FormLabel>Place</FormLabel>
                <Input type="text" />
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Create
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }