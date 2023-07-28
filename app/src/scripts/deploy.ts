import { JsonRpcSigner, ethers } from "ethers";
import EventTicketNft from '../artifacts/contracts/EventTicketNft.sol/EventTicketNft.json'
import { EventTicketNft as types} from '../../../types/contracts/EventTicketNft'
import { Alchemy,Network,GetBaseNftsForOwnerOptions } from "alchemy-sdk";
import dotenv from 'dotenv/config'

// Configures the Alchemy SDK
const config = {
  apiKey: process.env.REACT_APP_ALCHEMY_SEPOLIA_API_KEY, // Replace with your API key
  network: Network.ETH_SEPOLIA, // Replace with your network
};

// Creates an Alchemy object instance with the config to use for making requests
const alchemy = new Alchemy(config);

export  const deploy=async(signer:JsonRpcSigner|undefined,_eventName:string, _eventSymbol:string , _types:string[],_prices:ethers.BigNumberish[], _places:number[])=>{
  try {
    
  
  const factory = new ethers.ContractFactory(
    EventTicketNft.abi,
    EventTicketNft.bytecode,
    signer
  );
  let deployedContract= factory.deploy(_eventName,_eventSymbol,_types,_prices,_places);
  deployedContract=(await deployedContract).waitForDeployment()
  return deployedContract
  } catch (error) {
    console.log("error  when deploying the contract ==== ", error )   
  }
}

export const getContractInstance= async (address:string,provider:ethers.BrowserProvider|undefined)=>{
  const contract= new ethers.Contract(address, EventTicketNft.abi, provider);
  return contract
}

export const purchaseTicket=async (provider:ethers.BrowserProvider|undefined,uri:string,_type:string,amount:string,contract_address:string) =>{
  try {

    // Call the contract's payable function and send Ether
    //Get Contract
    let contract=await getContractInstance(contract_address,provider);  
    const signer= await provider?.getSigner();
    const connectedContract:types= contract.connect(signer!) as unknown as types;  
    const tx = await connectedContract.safeMint(uri,_type,{ value: ethers.parseEther(amount) });

    // Wait for the transaction to be mined and get the receipt
    const receipt = await tx.wait();
    return receipt
  

    console.log('Transaction receipt:', receipt);
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

export const isDeployer= async (deployer_address:string, contract_address:string)=>{
  try {
    //Get Contract
    console.log("contract  address  ", contract_address)
    let response = await alchemy.core.findContractDeployer(contract_address.toString());
    console.log("the response ", response);
    return response.deployerAddress===deployer_address

  } catch (error) {
    console.log("error calling isDeployer funciton", error)
  }
}

export const loadOwnerTickets= async (contract_address:string, provider:ethers.BrowserProvider|undefined) =>{
  try {

    
    const signer= await provider?.getSigner();

    
    let contractAddresses=[]
    contractAddresses.push(contract_address)
    let owner=signer?signer.address:'';
    const options: GetBaseNftsForOwnerOptions = {
      contractAddresses: contractAddresses,
      omitMetadata: false
    };
    let response = await alchemy.nft.getNftsForOwner(owner, options)
    return response;
  } catch (error) {
    console.error('Error sending transaction:', error);
  } 
}


export const loadBuyerTickets= async (contract_address:string, owner_address:string) =>{
  try {
    let contractAddresses=[]
    contractAddresses.push(ethers.getAddress(contract_address.toLowerCase()))
    const options: GetBaseNftsForOwnerOptions = {
      contractAddresses: contractAddresses,
      omitMetadata: false
    };
    let response = await alchemy.nft.getNftsForOwner(ethers.getAddress(owner_address.toLowerCase()))
    return response;
  } catch (error) {
    console.error('Error sending transaction:', error);
  } 
}
