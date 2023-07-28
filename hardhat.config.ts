import { HardhatUserConfig } from "hardhat/config";
require("@nomicfoundation/hardhat-toolbox") ;
import '@typechain/hardhat'
import '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-chai-matchers'
require('dotenv').config();

const alchemyApiKey = process.env.REACT_APP_ALCHEMY_SEPOLIA_API_KEY;
const privateKey = process.env.REACT_APP_SEPOLIA_PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  paths:{
    artifacts: "./app/src/artifacts"
  },
  networks:{
    goerli:{
      url:`https://eth-goerli.alchemyapi.io/v2/${alchemyApiKey}`,
      accounts : [`0x${privateKey}`]
    }
  },
  typechain: {
    outDir: "types",
    target: "ethers-v6", // For ethers.js v5
  },
  
};

export default config;
