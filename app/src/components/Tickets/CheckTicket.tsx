import {
  Box,
  Button,
  Heading,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  VStack,
  Link,
  Select,
  useColorModeValue,
  Tag,
  TagCloseButton,
  TagLabel,
  GridItem,
  AlertStatus,
  Spinner,
  Image
} from '@chakra-ui/react';
import React , {useState, useEffect } from 'react';
import { Grid } from '@chakra-ui/react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EventTicket from './TicketForm';
import html2canvas from 'html2canvas';
import handleImageUpload  from '../../IpfsClient';
import { storeEvent, readEvents } from '../../databases/crudEvent';
import {ethers} from 'ethers';
import { useWeb3 } from '../../contexts/Web3Context';
import { purchaseTicket, loadBuyerTickets } from '../../scripts/deploy';
import { readAllTickets } from '../../databases/crudTicket';
import { storeTicketOwner } from '../../databases/crudTicketsOwner';
import {CustomAlert} from '../utils/Alert';



type TicketType = 'GOLD' | 'SILVER' | 'DEFAULT';

interface TicketOption {
  eventId:string
  type: TicketType;
  places_limit: number;
  price:number;
}

interface EventType{
  contract_address:string;
  period:string;
  title:string;
  place:string;
  deployer:string;
}



export  function CheckTicket() {
  const [alertMessage, setAlertMessage]= useState<string>('');
  const [alertStatus, setAlertStatus]= useState<AlertStatus>("info");
  const [displayAlert, setDisplayAlert]=useState<boolean>(false);
  const [displaySpinner, setDisplaySpinner]=useState<boolean>(false);
  const [eventContract, setEventContract] = useState<string>('');
  const [ownerAddress, setOwnerAddress] = useState<string>('');
  const [events, setEvents]=useState<{key:string,val:EventType}[]>();
  const [tickets, setTickets]=useState<{val:{eventId:"",type: TicketType,places_limit: number, price:number},key:string}[]>([
    {val: {
      eventId: '',
      type: 'GOLD',
      places_limit: 100,
      price: 50,
    },
    key: 'default-ticket'
    }
  ])
  const [uris, setUris]=useState<string[]>([""]);
    
  const _displayAlert =()=>{
    setDisplayAlert(true);
    setTimeout(()=>{
      setDisplayAlert(false);
    },5000)
  }
  const  _loadUris=async()=>{
    setUris([''])
    setDisplaySpinner(true);
    const _uris: string[]=[]
    try {
      if(eventContract && ownerAddress){
       console.log("the event contract ", eventContract.toString());
       console.log("the owner address ", ownerAddress.toString());
        const currentUris= await loadBuyerTickets(eventContract, ownerAddress)
        console.log("the current uris === ", currentUris);
        if(currentUris?.ownedNfts!?.length>0)
        {
          await Promise.all(
            currentUris!.ownedNfts.map((ownedNft)=>{
              _uris.push(ownedNft!.tokenUri!.raw);
  
              //_nfts.push(ownedNft!.tokenUri!.raw)
          })
          );
          setAlertMessage("Chicket(s) finded");
          setAlertStatus("success")
          _displayAlert()
            setUris(_uris);
        }else{
          setAlertMessage("no ticket finded for this event");
          setAlertStatus("info")
          _displayAlert()
        }
        setDisplaySpinner(false);
      }
    } catch (error) {
      setAlertMessage("Oups something went wrong !");
      setAlertStatus("error")
      _displayAlert()
      setDisplaySpinner(false);
      console.log("error : ", error )
    }
    
    
  
  }
  return (
    <>
      {displaySpinner && (
        <>
        <Spinner/><span>wait for transaction</span>
        </>
      )
      }
      {displayAlert && (
        <CustomAlert message={alertMessage} status={alertStatus} />
      )
      }
    <Box textAlign="left" w='100%' fontSize="xl">
    <Grid w='100%' minH="100vh" p={3}>
      <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} >
        <Stack spacing={4} w={'full'} maxW={'md'}>
        <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Verify Attendee</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              Fill in Informations ✌️
            </Text>
          </Stack>
          <Box w="100%"
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4} w={'100%'}>
              <FormControl id="_event_contract">
                <FormLabel>Event Contract</FormLabel>
                <Input type="text" value={eventContract} onChange={(event)=>{setEventContract(event.target.value)}}/>
              </FormControl>
              <FormControl id="_owner_address">
                <FormLabel>Buyer Address</FormLabel>
                <Input type="text" value={ownerAddress} onChange={(event)=>{setOwnerAddress(event.target.value)}}/>
              </FormControl>
              <Stack spacing={10}>
                      <Button
                        bg={'blue.400'}
                        color={'white'}
                        onClick={_loadUris}
                        _hover={{
                          bg: 'blue.500',
                        }}>
                        Check
                      </Button>
                    </Stack>           
            </Stack>
          </Box>
        
        </Stack>
      </Flex>
      <Flex flex={1} h={'100%'}>
        <VStack  align='stretch' >
        {uris && uris.length>0 &&(
          <>
            {uris.map((uri,index)=>{
            return(
              <Box boxSize='sm' key={index}>
                <Image src={uri}  />
              </Box>
            )
          })}
          </> 
        )}
        </VStack >
        </Flex>
      </Stack>
    </Grid>
</Box>
</>
  );
}