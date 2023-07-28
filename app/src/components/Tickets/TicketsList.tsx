import {
  Box,
  Button,
  Heading,
  Text,
  GridItem,
  AlertStatus,
  Spinner
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
import { purchaseTicket, isDeployer } from '../../scripts/deploy';
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

export default function BuyTicket() {
  const [alertMessage, setAlertMessage]= useState<string>('');
  const [alertStatus, setAlertStatus]= useState<AlertStatus>("info");
  const [displayAlert, setDisplayAlert]=useState<boolean>(false);
  const [displaySpinner, setDisplaySpinner]=useState<boolean>(false);
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
  
  const _displayAlert =()=>{
    setDisplayAlert(true);
    setTimeout(()=>{
      setDisplayAlert(false);
    },5000)
  }
  const _provider=(useWeb3())._provider;
  const account=(useWeb3()).account;
  
  const signer=(useWeb3()).signer;
  const getEvents=async ()=>{
    const _events=await readEvents();
    setEvents(_events);
  }
  const getAllTickets=async()=>{
    const _tickets=await readAllTickets();
    setTickets(_tickets);
  }

  const _purchaseTicket=async (amount:string,type:string,contract_address:string)=>{
    //let's get the contract instance
    setDisplaySpinner(true);
    try {
      
     
    if(contract_address.length>1){
      const boxElement = document.getElementById('ticket-box-'+type);
          if (boxElement) {
                html2canvas(boxElement).then(async (canvas: HTMLCanvasElement) => {
                    const ticketImage = canvas.toDataURL('image/png');
                    // Do something with the ticket image, such as save or display it
                    try {
                      handleImageUpload(ticketImage).then((cid:string)=>{
                        console.log("the cid ====", cid);
                        let uri="https://ipfs.io/ipfs/"+cid;
                        
                       
                        purchaseTicket(_provider,uri,type,amount,contract_address).then((result)=>{
                            if(result?.status==1){
                              storeTicketOwner({contract_address:contract_address,owner_adress:account!})
                              setAlertMessage("Nft contract purchased successfully");
                              setAlertStatus("success")
                              _displayAlert();
                            }
                            else{
                              setAlertMessage("Oups something went wrong !");
                              setAlertStatus("error");
                              _displayAlert();
                            }
                            setDisplaySpinner(false);
                        })
                      })
                    } catch (error) {
                      console.log("Error when uploading to file to ipfs")
                      setDisplaySpinner(false);
                      setAlertMessage("Oups something went wrong !");
                      setAlertStatus("error")
                      _displayAlert();
                    }
                });
           }
    }else{
      console.log("can't get contract_address");
      setDisplaySpinner(false);
      setAlertMessage("Oups something went wrong !");
      setAlertStatus("error")
      _displayAlert();
    }
  }
    catch (error) {
      setDisplaySpinner(false);
      console.log("errror when deploying", error)
      setAlertMessage("Oups something went wrong !");
      setAlertStatus("error")
      _displayAlert();
    }
    
  }
  useEffect(()=>{
    getEvents()
    getAllTickets()
  },[])
  
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
          {events &&(
            <>
            <Text fontSize='xs'>If the list is empty then you're the only seller now and you can't buy your own ticket! </Text>
            {events?.filter((event) => event?.val?.contract_address?.length>1  && event.val.deployer !==account)
            .reverse().map((event,index)=>(
              
              <div key={index}>
                 <br />
                <Grid templateColumns='repeat(3, 1fr)' gap={6}>
                    <GridItem key={event?.key} w='100%' colSpan={3}   >
                      <Heading fontSize='1xl'>{event?.val?.title}</Heading>
                      <Text fontSize='xs'>Contract address: {event.val.contract_address}</Text>
                      
                    </GridItem>
                    {tickets?.filter((ticket) => ticket?.val?.eventId === event.key)
                    .map((ticket,_index) => (
                      
                      <GridItem key={ticket?.key} w='100%'  >
                         <div key={_index} style={{width:"100%"}}>
                          <EventTicket  price={ticket?.val?.price}  id={'ticket-box-'+ticket?.val?.type} eventName={event.val.title} ticketType={ticket?.val?.type} placeLimit={ticket?.val?.places_limit} date={event?.val?.period} time={""} place={event?.val?.place} owner={account} />
                          <Button onClick={()=>{_purchaseTicket((ticket.val.price).toString(),ticket.val.type,event.val.contract_address)}}>Get Ticket</Button>
                        </div>
                      </GridItem>
                     
                    ))}
                   
                </Grid>
              </div>
            ))}

            </>
          )}
    </Box>
    </>
  );
}

export  function DeployerTickets() {
  
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
    
  const _provider=(useWeb3())._provider;
  const account=(useWeb3()).account;
  
  const signer=(useWeb3()).signer;
  const getEvents=async ()=>{
    const _events=await readEvents();
    setEvents(_events);
  }
  const getAllTickets=async()=>{
    const _tickets=await readAllTickets();
    setTickets(_tickets);
  }


  useEffect(()=>{
    getEvents()
    getAllTickets()
  },[])
  
  return (
    <Box textAlign="left" w='100%' fontSize="xl" >
          {events &&(
            <>
             <Text fontSize='xs'>Your events should be listed below if empty this mean you don't create event yet !</Text>
            {events?.filter((event) => event?.val?.contract_address?.length>1  && event.val.deployer ===account).reverse()
            .map((event,index)=>(
              
              <div key={index}>
                <br />
                <Grid templateColumns='repeat(3, 1fr)' gap={6}>
                    <GridItem key={event?.key} w='100%' colSpan={3}   >
                      
                      <Heading fontSize='1xl'>{event?.val?.title}</Heading>
                      <Text fontSize='xs'>Contract address: {event.val.contract_address}</Text>
                    </GridItem>
                    {tickets?.filter((ticket) => ticket?.val?.eventId === event.key)
                    .map((ticket,_index) => (
                      
                      <GridItem key={ticket?.key} w='100%'  >
                         <div key={_index} style={{width:"100%"}}>
                          <EventTicket  price={ticket?.val?.price}  id={'ticket-box-'+ticket?.val?.type} eventName={event.val.title} ticketType={ticket?.val?.type} placeLimit={ticket?.val?.places_limit} date={event?.val?.period} time={""} place={event?.val?.place} owner={""} />
                        </div>
                      </GridItem>
                     
                    ))}
                   
                </Grid>
              </div>
            ))}

            </>
          )}
    </Box>
  );
}