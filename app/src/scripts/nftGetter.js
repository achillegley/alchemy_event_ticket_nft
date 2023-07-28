// Imports the Alchemy SDK
const { Alchemy, Network } = require("alchemy-sdk");

// Configures the Alchemy SDK
const config = {
    apiKey: "_bulO5MREx7MpnnRpEBqE_E1CGA7WHkS", // Replace with your API key
    network: Network.ETH_SEPOLIA, // Replace with your network
};

// Creates an Alchemy object instance with the config to use for making requests
const alchemy = new Alchemy(config);

const main = async () => {
    let address  = "0xe966131618db8055ACEC8c768E4A9819f1fa1D26";
    
    //let response = await alchemy.core.findContractDeployer(address)
    let response = await alchemy.nft.getNftsForOwner("0x59a0ECC4Dcf48ab54D24e038eF05fc68AAC5486b", contractAddresses=["0xDf66F060bfF97E250cd71315b9dD2F225171aB6F"])
    //Logging the response to the console
    console.log(response)
};

main();