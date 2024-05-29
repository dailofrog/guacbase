"use client"

import '../../styles/globals.css';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams  } from 'next/navigation';
import { BrowserProvider, ethers } from 'ethers';

import imgGuacAnim from '../../assets/images/guacanim.webp';

import CONTRACT_ABI  from "../../abi/GuacFaucet.json";

// v1: https://basescan.org/address/0x22141da3daBc468D978Bbd1b3983458D3D229136#code
// v2: https://basescan.org/address/0xa5117BC0eb877559A7DE4d8F994B3a790F409099#code
const CONTRACT_FAUCET_ADDRESS = "0xa5117BC0eb877559A7DE4d8F994B3a790F409099"; 

const CHAINS = {
  base : {
    name: "Base (Mainnet)",
    chaindId: 8453,
    chaindIdHex: "0x2105",
  },
  baseTest : {
    name:"Base Sepolia",
    chaindId: 84532,
    chaindIdHex: "0x14a34",
  }
}

const CHAIN = "base";

function isSameEthAddress(addr1, addr2) {
  if (addr1 == null || addr2 == null)
    return false;

  return addr1.toLowerCase() == addr2.toLowerCase();
}

const Content: React.FC = () => {

  const searchParams = useSearchParams();
  const [connectedUserAccount, setConnectedUserAccount] = useState<string | null>(null);

  // pulled from GET
  const [claimerUserAccount, setClaimeruserAccount] = useState<string | null>(searchParams.get('address') || null);
  const [fid, setFid] = useState<number | null>(searchParams.get('fid') || null);
  const [signature, setSignature] =  useState<string>(searchParams.get('signature') || '');
  const [expireTimestamp, setExpireTimestamp] = useState<number | null>(searchParams.get('timestamp') || 0);

  // pulled from contract
  const [claimAmmount, setClaimAmount] = useState<number | null>(-1);

  const [error, setError] = useState<string>('');
  const [txnHash, setTxnHash] = useState<string | null>(null);

  useEffect(() => {
    trySwitchNetwork();
  }, []);

  useEffect(()=> {
    if (connectedUserAccount != null) {
      fetchClaimAmount();

    }
  },[connectedUserAccount]);

  const fetchClaimAmount = async() => {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = await provider.getSigner();
      const contract:any = new ethers.Contract(CONTRACT_FAUCET_ADDRESS, CONTRACT_ABI.abi, signer);

      const txn = await contract.checkClaimableAmount(connectedUserAccount);
      setClaimAmount(ethers.utils.formatEther(txn));
  }

  const tryConnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Connect to the wallet
        const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setConnectedUserAccount(accounts[0]);
        setError('');
      } catch (error: any) {
        console.error('Error connecting to wallet:', error);
        setError(error.message || 'An error occurred during wallet connection .');
      }
    } else {
      setError('Unable to connect wallet. Please connect.');
    }
  };

  const trySwitchNetwork = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {

        // Switch to a specific network (e.g., Ropsten Testnet)
        await switchNetwork(CHAINS[CHAIN].chaindIdHex); // Ropsten Testnet chainId is 3
      } catch (error: any) {
        console.error('Error switching network:', error);
        setError(error.message || 'An error occurred  network switching.');
      }
    } else {
      setError('Ethereum wallet not detected. Please install MetaMask.');
    }
  };

  const switchNetwork = async (chainIdHex: number) => {

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError: any) {

       console.error('Error switching Ethereum chain:', switchError);
        setError(`Make sure you are on ${CHAIN} chain, then refresh.`);

        /*
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
                rpcUrl: '...' // Provide the RPC URL of the chain (e.g., Ropsten Testnet)
              },
            ],
          });
        } catch (addError: any) {
          console.error('Error adding Ethereum chain:', addError);
          setError('Error adding Ethereum chain.');
        }
      } else {
        console.error('Error switching Ethereum chain:', switchError);
        setError(`Make sure you are on ${CHAIN} chain, then refresh.`);
      }*/
    }
  };

  const executeContractFunction = async () => {
    try {
      const { ethereum } = window;

      //const provider = ethers.getDefaultProvider();
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = await provider.getSigner();

      //const accounts: string[] = await provider.send("eth_requestAccounts", []);
      const contract:any = new ethers.Contract(CONTRACT_FAUCET_ADDRESS, CONTRACT_ABI.abi, signer);

      

      console.log(`executing contract call: claimGuacSigned(${fid},${expireTimestamp},${signature})`);

      //const txn = await contract.claimGuac();
      const txn = await contract.claimGuacSigned(fid, expireTimestamp, signature);

      console.log("Transaction hash is ", txn.hash);
      setTxnHash(txn.hash);

      let receipt = await txn.wait();
      console.log("Receipt ", receipt);
    } catch (error: any) {
      console.error('Error executing contract function:', error);
      setError(`Error executing contract function: ${error}`);
    }
  };

  return (

    <>

     <div className="flex-container-claim ">

           <div className="container-claim">
        < h1>🥑 Claim $GUAC</h1>
        <p className="error">Faucet has now been turned off forever.</p>

        {/*
          <img className="guacanim" src={imgGuacAnim.src} alt="GUAC Emission Curve" />
        }
        <img className="guacanim" src={imgGuacAnim.src} alt="GUAC Emission Curve" />
        <img className="guacanim" src={imgGuacAnim.src} alt="GUAC Emission Curve" />
        <br/>
        <br/>

        {!connectedUserAccount && <button onClick={tryConnectWallet}>Connect Wallet</button>}
        {connectedUserAccount &&  <p>Connected address:<br/>🟢<strong>{connectedUserAccount}</strong></p>}

        {isSameEthAddress(connectedUserAccount,claimerUserAccount) && 
            <button onClick={executeContractFunction}>🥑 Claim {claimAmmount > 0 ? Number(claimAmmount).toFixed(6) : ""} $GUAC</button>
        }
        {connectedUserAccount && !isSameEthAddress(connectedUserAccount,claimerUserAccount) && <div className="error">Error: Connected account is not same as claimer.<br/><br/>You are currently connected as <strong>{connectedUserAccount}</strong> on this page (thru Metamask?) but is expecting your Farcaster account <strong>{claimerUserAccount}</strong>.</div>}
        {error && <div className="error">{error}</div>}
        {txnHash && <p>Transaction Sent:<br/><a href={`https://basescan.org/tx/${txnHash}`} target="_blank">{txnHash}</a></p>
}

        <br/>
        <br/>
        <p>Faucet Contract:<br/>→ <a href={`https://basescan.org/address/${CONTRACT_FAUCET_ADDRESS}`} target="_blank">{CONTRACT_FAUCET_ADDRESS}</a></p>
        <p>Chain:<br/>{CHAINS[CHAIN].name}</p>

        <ul>
        <li>Claimooor: {claimerUserAccount ? claimerUserAccount : "(Not found)"}</li>
        <li>FID: {fid ? fid : "(Not found)"}</li>
        <li>Signature: {signature ? signature : "(Not found)"}</li>
        <li>Expire Timestamp: {expireTimestamp ? expireTimestamp : "(Not found)"}</li>
        </ul>

        <p>→ <a href="/">Read $GUAC Whitepaper</a></p>

        <p>Questions? <a href="https://twitter.com/dailofrog/" target="_blank">@dailofrog</a></p>

        <br/>

        */}
        </div>
    </div>

    </>


  );
};

const Page: React.FC = () => {
  return (
    <>  
       <Suspense fallback={<>Loading...</>}>
      <Content/>
      </Suspense>
    </>
  )
}
export default Page;
