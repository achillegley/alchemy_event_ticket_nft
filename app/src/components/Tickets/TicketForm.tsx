import { Box, Button, Divider, Flex, Heading, Text, Grid, GridItem } from '@chakra-ui/react';
import { CalendarIcon, TimeIcon, AtSignIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useRef } from 'react';
import html2canvas from 'html2canvas';

import QRCode from 'react-qr-code';
type TicketProps = {
  id: string;
  eventName: string;
  ticketType: string;
  placeLimit: number;
  date: string;
  time: string;
  place: string;
  price: number;
  owner?:string
};

export default function EventTicket({ id, eventName, ticketType, placeLimit, date, time, place, price, owner }: TicketProps) {
  const ticketRef = useRef<HTMLElement>(null);

  const getBackgroundColor = () => {
    if (ticketType === 'GOLD') return 'orange';
    if (ticketType === 'SILVER') return 'silver';
    if (ticketType === 'DEFAULT') return 'black';
    return 'black';
  };
  const getBorderColor = () => {
    if (ticketType === 'GOLD') return 'orange.500';
    if (ticketType === 'SILVER') return 'silver.500';
    if (ticketType === 'DEFAULT') return 'black.500';
    return 'black.500';
  };

  const handleCheckIn = () => {
    const boxElement = document.getElementById('ticket-box');
    if (boxElement) {
      html2canvas(boxElement).then((canvas: HTMLCanvasElement) => {
        const ticketImage = canvas.toDataURL('image/png');
        // Do something with the ticket image, such as save or display it
        console.log('Ticket Image:', ticketImage);
      });
    }
  };
  return (
    <Box id={id} border='2px' borderWidth="1px" h='285' bg={getBackgroundColor()} borderRadius="lg" p={6} maxW="md" mx="auto" width="100%" borderColor={'yellow.100'}>
      <Heading size="md" textAlign="center" mb={4}>
        {eventName}
      </Heading>
      <Text fontWeight="bold" textAlign="center" fontSize="sm" mb={4}>
        {ticketType}
      </Text>
      <Text fontSize="sm" textAlign="center" my={4}>
        Place Limit: {placeLimit}
      </Text>
      <Divider my={6} />
      <Grid templateColumns='repeat(3, 1fr)' gap={2}>
        <GridItem w='100%' colSpan={2} >
          <Flex fontSize="sm" align="center" mb={2}>
            <CalendarIcon boxSize={5} mr={2} />
            <Text>{date}</Text>
          </Flex>
          {/* <Flex align="center" mb={2}>
                <TimeIcon boxSize={5} mr={2} />
                <Text>{time}</Text>
            </Flex> */}
          <Flex fontSize="sm" align="center" mb={4}>
            <AtSignIcon boxSize={5} mr={2} />
            <Text>{place}</Text>
          </Flex>
          <Flex fontSize="sm" align="center" mb={4}>
            <HamburgerIcon boxSize={5} mr={2} />
            <Text>{price} ETH</Text>
          </Flex>
        </GridItem>
        <GridItem w='100%' >
          <Flex fontSize="xs" align="right" mb={4}>
            <QRCode value={ `title:${eventName}, type: ${ticketType}, date: ${date}, time: ${time},place:${place} buyer:${owner}`} size={70} />
          </Flex>
        </GridItem>
      </Grid>

      {/*       
      <Button size="lg" colorScheme="blue" w="100%" onClick={handleCheckIn}>
        Check-In
      </Button> */}

    </Box>
  );
}
