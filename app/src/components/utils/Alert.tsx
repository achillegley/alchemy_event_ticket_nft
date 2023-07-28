
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    AlertStatus, 
  } from '@chakra-ui/react'
  import React from 'react';
export  const CustomAlert: React.FC<{message:string, status:AlertStatus}> =({message,status})=>{
    return(
        <Alert status={status}>
            <AlertIcon />
            <AlertTitle>{message} </AlertTitle>
        </Alert>
    )
   
} 