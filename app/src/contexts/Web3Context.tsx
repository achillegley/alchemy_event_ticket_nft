// src/contexts/Web3Context.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import {ethers, ContractRunner} from 'ethers';
const provider = new ethers.BrowserProvider(window.ethereum);


declare global {
     interface Window{
       ethereum:any
     }
}
interface Web3ContextProps {
  account?: string ;
  signer?:ethers.JsonRpcSigner;
  _provider?:ethers.BrowserProvider;
}

type Web3ContextProviderProps = {
    children: React.ReactNode; // Specify the type of children as React.ReactNode
  };

const Web3Context = createContext<Web3ContextProps>({ });

const Web3Provider: React.FC<Web3ContextProviderProps> = ({ children }) => {
  const [account, setAccount]=useState<string>()
  const [signer, setSigner]=useState<ethers.JsonRpcSigner>();
  const [_provider, setProvider]=useState<ethers.BrowserProvider|undefined>();  

  
  // Function to handle the Metamask login
  const handleLogin = async () => {
    setProvider(provider)
    try {
      // Request access to the user's MetaMask wallet
      const accounts:string[] =await provider.send('eth_requestAccounts',[] );
      // Check if the user is connected
      if (accounts.length>0 ) {
        setAccount(accounts[0]);
        setSigner(await provider.getSigner());
      }
    } catch (error) {
      console.error('Error connecting to Metamask:', error);
    }
  };

  useEffect(() => {
    // Check if MetaMask is installed
   handleLogin()

    // Add event listener to handle account changes
    window.ethereum.on('accountsChanged', handleLogin);
  }, [account]);

  return <Web3Context.Provider value={{ account,signer, _provider }}>{children}</Web3Context.Provider>;
};

const useWeb3 = () => {
  return useContext(Web3Context);
};

export { Web3Provider, useWeb3 };
