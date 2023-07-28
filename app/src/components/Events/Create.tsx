import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    VStack,
    Link,
    Button,
    Heading,
    Select,
    Text,
    useColorModeValue,
    Tag,
    TagCloseButton,
    TagLabel,
    Image,
    AlertStatus,
    Spinner
  } from '@chakra-ui/react';
  import React , { FormEvent,useState, useEffect } from 'react';
  import { useControllableProp, useControllableState,Grid } from '@chakra-ui/react'
  import DatePicker from 'react-datepicker';
  import 'react-datepicker/dist/react-datepicker.css';
  import EventTicket from '../Tickets/TicketForm';
  import html2canvas from 'html2canvas';
  import handleImageUpload  from '../../IpfsClient';
  import { storeEvent } from '../../databases/crudEvent';
  import {ethers} from 'ethers';
  import { useWeb3 } from '../../contexts/Web3Context';
  import { deploy } from '../../scripts/deploy';
  import {CustomAlert} from '../utils/Alert'

  

  type TicketType = 'GOLD' | 'SILVER' | 'DEFAULT';

  interface TicketOption {
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

  export default function CreateTicket() {
    const [alertMessage, setAlertMessage]= useState<string>('');
    const [alertStatus, setAlertStatus]= useState<AlertStatus>("info");
    const [displayAlert, setDisplayAlert]=useState<boolean>(false);
    const [displaySpinner, setDisplaySpinner]=useState<boolean>(false);
    const [selectedOptions, setSelectedOptions] = useState<TicketOption[]>([]);
    const [selectedDateTime, setSelectedDateTime] = useControllableState<Date|null>({ defaultValue: null });
    const [selectedType, setSelectedType] = useState<TicketType | ''>('');
    const [title, setTitle] = useState<string>('');
    const [period, setPeriod] = useState<string>('');
    const [place, setPlace] = useState<string>('');
    const [displayCard, setDisplayCard] =useState<boolean>(false);
    const [contractAddress, setContractAddress]= useState<string|ethers.Addressable>('');
    const provider=ethers.JsonRpcProvider;
    
    const signer=(useWeb3()).signer
    const account=(useWeb3()).account
    
    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedType(event.target.value as TicketType);
      setSelectedOptions((prevOptions:TicketOption[]) =>
      prevOptions.find((option) => option.type === event.target.value)
        ? prevOptions
        : [
            ...prevOptions,
            { type: event.target.value as TicketType, places_limit: 0 ,price:0},
          ]
      );
       
    };
    const handleDateTimeChange = (date: Date) => {
        setSelectedDateTime(date);
        setPeriod(date.toString());
      };
  
    const handleRemoveOption = (type: TicketType) => {
      const updatedOptions = selectedOptions.filter(
        (option:TicketOption) => option.type !== type
      );
      setSelectedOptions(updatedOptions);
    };

    const handleCreateEvent=(event:FormEvent)=>{
      event.preventDefault();  
      setDisplayCard(true);
    }

    const handlePlacesLimitChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const places_limit = parseInt(event.target.value);
      const updatedOptions = selectedOptions.map((option:TicketOption) =>
        option.type === selectedType ? { ...option, places_limit } : option
      );
      setSelectedOptions(updatedOptions);
    };

    const handlePriceChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const price = Number(event.target.value);
      const updatedOptions = selectedOptions.map((option:TicketOption) =>
        option.type === selectedType ? { ...option, price } : option
      );
      setSelectedOptions(updatedOptions);
    };

    
    const hideAlert =()=>{
      setTimeout(()=>{
        setDisplayAlert(false);
      },5000)
    }
    const deployContract =async()=>{
      //let's format datas
      setDisplaySpinner(true);
      try {
        if(account){
          const d_types:string[]=[];
          const d_places:number[]=[];
          const d_prices:ethers.BigNumberish[]=[];
          selectedOptions.forEach( (option:TicketOption ) => {
            d_types.push(option.type);
            d_prices.push(ethers.parseEther(option.price.toString()));
            d_places.push(option.places_limit);
          });
          //let's now deploy the contract
          deploy(signer,title,title.slice(0,3),d_types,d_prices,d_places).then((contract_address)=>{
            console.log("contract address === ", contract_address)
            if(contract_address){
              storeEvent({contract_address:(contract_address.target).toString(),period:period,title:title, place:place , deployer:account?account:""},selectedOptions)
              setContractAddress(contract_address.target);
              setAlertMessage("Nft contract deployed successfully");
              setAlertStatus("success")
              setDisplayAlert(true)
              hideAlert()
            }
            else{
              setAlertMessage("Oups something went wrong !");
              setAlertStatus("error")
              setDisplayAlert(true)
              hideAlert()
            }
           
            setDisplaySpinner(false);

          })
        }else
        {
          setDisplaySpinner(false);
          setAlertMessage("Please connect your metamask !");
          setAlertStatus("error")
          setDisplayAlert(true)

          hideAlert()
        }
    } catch (error) {
      setDisplaySpinner(false);
      console.log("errror when deploying", error)
      setAlertMessage("Oups something went wrong !");
      setAlertStatus("error")
      setDisplayAlert(true)

      hideAlert();
    }
      
    }
    const handleValidateTicket= async()=>{
      //let's deploy the contract
      await deployContract()
      
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
                  <Heading fontSize={'4xl'}>Create Nft Ticket</Heading>
                  <Text fontSize={'lg'} color={'gray.600'}>
                    Fill in your event Informations ✌️
                  </Text>
                </Stack>
                <Box w="100%"
                  rounded={'lg'}
                  bg={useColorModeValue('white', 'gray.700')}
                  boxShadow={'lg'}
                  p={8}>
                  <Stack spacing={4} w={'100%'}>
                    <FormControl id="_label">
                      <FormLabel>Event Title</FormLabel>
                      <Input type="text" value={title} onChange={(event)=>{setTitle(event.target.value)}}/>
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
                      <Input type="text" value={place} onChange={(event)=>{setPlace(event.target.value)}}/>
                    </FormControl>
                    <FormControl id="_types">
                      <Select value={selectedType} onChange={handleTypeChange}>
                        <option value="">Select a ticket type</option>
                        <option value="GOLD">GOLD</option>
                        <option value="SILVER">SILVER</option>
                        <option value="DEFAULT">DEFAULT</option>
                      </Select>
                      
                    </FormControl>
                    {selectedType && (
                        <>
                        <FormControl id="_types">
                          <FormLabel>Places limit</FormLabel>
                          <Input
                            type="number"
                            placeholder="Places Limit"
                            value={
                              selectedOptions.find((option:TicketOption) => option.type === selectedType)
                                ?.places_limit || 0
                            }
                            onChange={handlePlacesLimitChange}
                          />
                          
                        </FormControl>
                        <FormControl id="_price">
                          <FormLabel>Price Eth</FormLabel>
                            <Input
                            type="number"
                            placeholder="Price Eth"
                            value={
                              selectedOptions.find((option:TicketOption) => option.type === selectedType)
                                ?.price ||0
                            }
                            onChange={handlePriceChange}
                          />
                        </FormControl>
                        </>
                      )}
                      {selectedOptions.map((option:TicketOption) => (
                        <Tag
                          key={option.type}
                          size="md"
                          variant="subtle"
                          colorScheme="cyan"
                          borderRadius="full"
                        >
                          <TagLabel>{option.type}</TagLabel>
                          <TagCloseButton onClick={() => handleRemoveOption(option.type)} />
                          <Text>&nbsp; {` Places Limit : ${option.places_limit} `} &nbsp;</Text>
                          <Text>{`  Price: ${option.price} `}</Text>
                        </Tag>
                      ))}
                    <Stack spacing={10}>
                      <Button
                        bg={'blue.400'}
                        color={'white'}
                        onClick={handleCreateEvent}
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
            <Flex flex={1} h={'100%'}>
            <VStack  align='stretch' >
            {displayCard &&(<Button onClick={handleValidateTicket}>Validate</Button>)}
            {displayCard && selectedOptions &&(
                selectedOptions.map((option:TicketOption,index)=>(
                  option.places_limit>0 && option.price>0 &&(
                      <EventTicket  price={option.price} key={index} id={'ticket-box-'+option.type} eventName={title} ticketType={option.type} placeLimit={option.places_limit} date={period} time={""} place={place} />
                  )
                )) 
              )
            }
            </VStack >
              </Flex>
            </Stack>
          </Grid>
      </Box>
      </>
    );
  }