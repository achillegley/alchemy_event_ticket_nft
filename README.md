# CREATE TICKETS AS  FOR YOUR EVENT

This project is willing to help event organizers to create uniqueness NFT ticket for their Event with trustable checkng process. 
This help avoid fraud and assure confidentiality of attendees. This project severs as my final project for alchmeny certification.

## The worflow
    #Event Creation
        The event Organizer filling Event informations like ( title, place, time) and sepecify ticket  Type (GOLD, SILVER, DEFAULT) and each place Limit.
        . The event Contract is then deployed with enforce informations( impossible to mint more than sepcified place limit for each ticket )
        . Confirm payment for event deployment.
        . Orgnanizer load their created event list
    #Ticket Purchase  "NFT MEETING"
        . Users can load Created Event Ticket 
        . Choose and Purchase a Ticket( This process will create personnalized ticket with Qr code that contain event informations and User address)
        . Confirm Payment for minting Ticket
        . The prices correspond to the ticket type and the value will be send to the contract deployer( the event Creator)
        . After purchase users can still view their purchased tickets 
    #Ticket Checking
        . Organizers or normal users can check their ticket by providing the event contract address and the buyer address
        . Remenber the event contract address and the buyer address can be revealed by scanning the Ticket QR code

## Installation
```bash
  #node version: 19.8.1
  cd project #after git clone
  npm install #this will install hardhat and typechain
  cd app
  npm install #this will install chakra ui for typescript
```

## Compile Contract
```bash
  cd project
  npx harhat compile #remember to add necessary .env variable before
  npx hardhat typechain #this will generate type folder this will help for typescript typing for contract method
  cd app
  npm install #this will install chakra ui for typescript
  #ps: if your seeing type error about "omitMetadata" in file app/src/scripts/deploy.ts then go the file app/node_modules/alchemy-sdk/dist/src/types/types.d.ts interface GetBaseNftsForOwnerOptions  and change omitMetadata  type to boolean instead of true.
  
```
## About Me
I'm full stack web( python, react typescript) devloper and blockchain enthusiast. 