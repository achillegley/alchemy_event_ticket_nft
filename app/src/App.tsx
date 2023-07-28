import * as React from "react"
import { BrowserRouter as Router,
  Routes,
  Route} from "react-router-dom"

import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  GridItem,
  theme,
} from "@chakra-ui/react"

import { Logo } from "./Logo"
import CreateTicket from "./components/Events/Create"
import BuyTicket ,{DeployerTickets} from "./components/Tickets/TicketsList"
import Simple from "./navigation/NavBar"
import MyTickets from "./components/Tickets/OwnerTicketsList"
import { CheckTicket } from "./components/Tickets/CheckTicket"

import { Web3Provider } from './contexts/Web3Context';




export const App = () => (
    <Web3Provider>
    <ChakraProvider theme={theme}>
      
      <Router>
      <Simple />
        <Routes>
          <Route path="/create-event" element={<CreateTicket/>} />
          <Route path="/buy-ticket" element={<BuyTicket />}/>
          <Route path="/my-tickets" element={<MyTickets />}/>
          <Route path="/my-events" element={<DeployerTickets />}/>
          <Route path="/check-tickets" element={<CheckTicket />}/>
          <Route path="/" element={<CreateTicket/>} />
        </Routes>
      </Router>
    </ChakraProvider>
    </Web3Provider>
    
)
