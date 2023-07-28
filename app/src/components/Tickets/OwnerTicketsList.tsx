import {
  Box,
  Image,
  Stack,
  Grid,
  Text
} from '@chakra-ui/react';
import React , { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { loadOwnerTickets } from '../../scripts/deploy';
import { readAllTicketOwners } from '../../databases/crudTicketsOwner';
import { ethers } from "ethers";


interface TicketOwner {
  contract_address: string;
  owner_adress: string;
}

export default function MyTickets() {
 
  const [uris, setUris]=useState<string[]>([""]);
  const [ticketsOwners, setTicketsOwners]=useState<{key:string,val:TicketOwner}[]>([]);
  const _account= (useWeb3()).account;
  const _provider=(useWeb3())._provider;
  
  useEffect(()=>{
   
    loadTickets()
   
  },[_account])

  useEffect(()=>{
    _loadUris();
   
  },[ticketsOwners])

  const loadTickets= async ()=>{
    try {
      if(_provider!=undefined){
        let ticketOwners:{val:TicketOwner,key:string}[]=[{val:{contract_address:"",owner_adress:""},key:""}]
        ticketOwners= await readAllTicketOwners();
        const _ticketsOwners=ticketOwners.filter((ticketOwner)=>ticketOwner.val.owner_adress===_account);
        setTicketsOwners(_ticketsOwners);
      }
    

    } catch (error) {
      console.log("error when loading ticket owners", error)
    }
  }

  const  _loadUris=async()=>{
    if(ticketsOwners.length>0){
      const _nfts:string[]=[]
     const _uris: string[]=[]
      await Promise.all(
        ticketsOwners.map(async (ticketOwner)=>{
            const currentUris= await loadOwnerTickets(ticketOwner.val.contract_address, _provider)
            
            currentUris!.ownedNfts.map((ownedNft)=>{
                
                _uris.push(ownedNft!.tokenUri!.raw);
              
                //_nfts.push(ownedNft!.tokenUri!.raw)
            })
          })
        );

      setUris(_uris);
  }
  }

  
  

  
  return (

    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      <Text fontSize='xs'>If the list is empty this mean you d'ont buy any ticket yet !</Text>
    {uris && uris.length>0 &&(
      
      <>
        {uris.map((uri,index)=>{
          return(
            <Box boxSize='sm' key={index}>
              <Image src={uri} />
            </Box>
          )
        })}
       </> 
    )}
     </Grid>)
}