// pages/api/game.ts

import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';
import { keccak256 } from 'js-sha3';
//import * as abi from 'ethereumjs-abi';

import { getTimestampedImageUrl, toQueryString } from '../../utils/utils';
import { Frame, buildFrameMeta, buildFrameDebugHtml } from '../../utils/frame';
import { getAddrByFid, getUsernameByFid, getFrameData } from '../../utils/farcaster';

import CONTRACT_ABI  from "../../abi/GuacFaucet.json";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ETHEREUM_NODE_URL = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;  // e.g., Infura endpoint
//const ETHEREUM_NODE_URL = `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;  // e.g., Infura endpoint
const provider = new ethers.providers.JsonRpcProvider(ETHEREUM_NODE_URL);

const CONTRACT_FAUCET_ADDRESS = process.env.CONTRACT_ADDRESS_FAUCET!;
const contractFaucet:any = new ethers.Contract(CONTRACT_FAUCET_ADDRESS, CONTRACT_ABI.abi, provider);

async function sendErrorMsg(res, errorMsg) {

  const queryParams = {
    errorMsg:errorMsg
  };

  // default: show starting page
   const baseUrl = process.env.API_SERVER;
  let ogImageUrl = `${baseUrl}/api/imagegen/error?${toQueryString(queryParams)}`;
  ogImageUrl = getTimestampedImageUrl(ogImageUrl);

  const frame: Frame = {
    img: ogImageUrl,
    buttons: [{ label: "Try Again" }],
    posturl: `api/claim`,
  };

  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        ${buildFrameMeta(frame)}
        <title>Guac (Error)</title>
      </head>
      <body>
         <h1>GUAC Faucet</h1>
         ${buildFrameDebugHtml(frame)}
         <p>Contract <a target="_blank" href="https://${ETHEREUM_NODE_URL.includes("sepolia")? "sepolia." : ""}basescan.org/address/${CONTRACT_FAUCET_ADDRESS}"">${CONTRACT_FAUCET_ADDRESS}</a></p>
      </body>
    </html>
  `);

}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const CHECK_ETHEREUM_WALLET_CONNECTED = true;
  const CHECK_RECASTED_AND_FOLLOWED = true;
  const baseUrl = process.env.API_SERVER;

  {
    res.status(500).send(`Error message: Fuacet is now off, forever.`);
    return;
  }


  if (!req?.body?.trustedData) {
    res.status(500).send(`Error message: No farcaster data provided`);
    return;
  }

  //console.log(`Request body: ${JSON.stringify(req.body)}`);

  const frameBody = await getFrameData(req.body.trustedData.messageBytes);
  //console.log("Frame data body:", JSON.stringify(frameBody));


  if (!frameBody?.action?.interactor) {
    res.status(500).send(`Error message: No farcaster interactor`);
    return;
  }

  if (!frameBody?.action?.cast) {
    res.status(500).send(`Error message: No farcaster cast`);
    return;
  }


  const isValid:boolean = frameBody.valid;
  const fid: string | null | undefined  = frameBody.action.interactor.fid;
  const userAddress: string | null | undefined  = frameBody.action.interactor.verifications[0] || null;
  const userDisplayName : string | null | undefined = frameBody.action.interactor.username || null;

  const isBeingFollowed :boolean = frameBody.action.interactor.viewer_context.following || false;
  const hasRecastedPost :boolean = frameBody.action.cast.viewer_context.recasted || false;
  const hasLikedPost :boolean = frameBody.action.cast.viewer_context.liked || false;
  //console.log(`Frame: isValid: ${isValid}, msg: ${JSON.stringify(message)}`);

/*
  // TEMP!!! data
  const isValid:boolean = true;
  const fid: string | null | undefined  = 420;
  const userAddress: string | null | undefined  = "0x4aBf2123BcDDCe3F853066645aE2E0e1c1A7d0e9";
  const userDisplayName : string | null | undefined = "boopdisplayname";
  const isBeingFollowed :boolean = false;
  const hasRecastedPost :boolean = false;
  const hasLikedPost :boolean = false;
*/

  if (!isValid) {
    res.status(500).send(`Error message: Invalid farcaster interaction`);
    return;
  }

  const tryClaim = req.query.tryClaim || 0;

  function getTimestampForOneHourFromNow(): number {
    // Get current timestamp in milliseconds
    const now = Date.now();
    
    // Add one hour (3600 seconds * 1000 milliseconds/second)
    const oneHourFromNow = now + 3600 * 1000;
    
    // Convert to seconds for Ethereum compatibility
    return Math.floor(oneHourFromNow / 1000);
  }

  async function signMessage(timestamp:number): Promise<string> {
    const abi = new ethers.utils.AbiCoder();

    // Convert address and fid to the right format (32 bytes) and encode
    const encodedAddress = abi.encode(["address"], [userAddress]);
    const encodedFid = abi.encode(["uint256"], [fid]);
    const encodedTimestamp = abi.encode(["uint256"], [timestamp]);

    // Concatenate and hash
    const message = ethers.utils.solidityPack(["address", "uint256", "uint256"], [userAddress, fid, timestamp]);
    const messageHash = ethers.utils.keccak256(message);

    // Create a wallet instance
    const wallet = new ethers.Wallet(process.env.BOT_ETH_PRIVATE_KEY);
    const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash));
    
    return signature;
  }

  if (isValid && tryClaim) {

    const timestamp = getTimestampForOneHourFromNow();

    const queryParams = {
      fid: fid,
      address: userAddress, 
      timestamp: timestamp,
      signature: await signMessage(timestamp),
    };

    const redirectLoc =  `https://guac.cool/claim?${toQueryString(queryParams)}`;
    console.log(`Claiming. Sending redirect: ${redirectLoc}` );
    res.status(302).setHeader('Location', redirectLoc).send(``);
    return;
  }
  //let userAmountJustClaimed = req.query.tryClaim ||0;
  //console.log(`sign message`, await signMessage());
  console.log(`tryclaim: ${tryClaim}`);

    // check ethereum wallet
  if (CHECK_ETHEREUM_WALLET_CONNECTED && (userAddress == null || userAddress == "0x0000000000000000000000000000000000000000")) {
    sendErrorMsg(res, "No Ethereum wallet connected with account.");
    return;
  }

  // TODO: check recast 
  if (CHECK_RECASTED_AND_FOLLOWED && (!isBeingFollowed || !hasRecastedPost || !hasLikedPost)) {
    sendErrorMsg(res, "Must recast, like and follow to claim $GUAC.");
    return;
  }


  async function getContractData() {
    // Initialize the array with common contract calls
    const promises = [
      contractFaucet.maxEmission(),
      contractFaucet.totalTokensClaimed(),
      contractFaucet.boostFactor(),
      contractFaucet.totalTimesClaimed(),
    ];

    // Check if userAddress is a valid non-null address
    const isValidAddress = userAddress;// && ethers.utils.isAddress(userAddress);

    // Add user-specific elements if userAddress is valid
    if (isValidAddress) {
      promises.push(
        contractFaucet.checkClaimableAmount(userAddress),
        contractFaucet.timeUntilNextClaim(userAddress),
        contractFaucet.userInfo(userAddress),
        contractFaucet.holdsERC721(userAddress),
      );
    }

    // Use Promise.all to execute all promises
    try {
      const results = await Promise.all(promises);

      // Build the return object
      let returnData:any = {
        // faucet data
        guacMaxSupply: parseInt(ethers.utils.formatEther(results[0])),
        guacTokensClaimed: parseInt(ethers.utils.formatEther(results[1])),
        guacBoostFactor: parseInt(results[2]),
        guacTotalTimesClaimed: parseInt(results[3]),
      };

      // Add user data if userAddress is valid
      if (isValidAddress) {
        returnData = {
          ...returnData,
          // user data
          userAmountClaimable: parseInt(ethers.utils.formatEther(results[4])),
          userAmountCooldownSecs: parseInt(results[5]),
          userTokensClaimed: parseInt(ethers.utils.formatEther(results[6][1])),
          userClicks: parseInt(results[6][2]),
          holdsERC721: parseInt(results[7]),
        };
      }

      return returnData;
    } catch (error) {
      // Handle error if any of the promises fail
      throw error;
    }
  }


  const contractData = await getContractData();

  const queryParams = {
    guacTokensClaimed: contractData.guacTokensClaimed,
    guacMaxSupply: contractData.guacMaxSupply,
    guacTotalTimesClaimed: contractData.guacTotalTimesClaimed,

    userAddress: userAddress,
    userEns: null,
    userDisplayName: userDisplayName,
    userTokensClaimed: contractData.userTokensClaimed,
    userClicks: contractData.userClicks,
    userBoosts: contractData.holdsERC721 ?contractData.guacBoostFactor/100 :  1,
    userAmountClaimable: contractData.userAmountClaimable,
    userAmountCooldownSecs: contractData.userAmountCooldownSecs,
    //userAmountJustClaimed: userAmountJustClaimed,
  };
  try {
  // default: show starting page
  let ogImageUrl = `${baseUrl}/api/imagegen/mine?${toQueryString(queryParams)}`;
  ogImageUrl = getTimestampedImageUrl(ogImageUrl);

  const isClaimable = contractData.userAmountCooldownSecs == 0 ;

  const buttons = [];
  buttons.push({ redirect:isClaimable, label: isClaimable ? `🥑 Claim ${contractData.userAmountClaimable} $GUAC` :"Refresh" });

  const frame: Frame = {
    img: ogImageUrl,
    buttons: buttons,
    posturl: `api/claim?tryClaim=1`,
  };

  function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')   // Replace & with &amp;
        .replace(/</g, '&lt;')    // Replace < with &lt;
        .replace(/>/g, '&gt;')    // Replace > with &gt;
        .replace(/"/g, '&quot;')  // Replace " with &quot;
        .replace(/'/g, '&#39;');  // Replace ' with &#39;
}

  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        ${buildFrameMeta(frame)}
        <title>Guac</title>
      </head>
      <body>
         <h1>GUAC Faucet</h1>
         ${buildFrameDebugHtml(frame)}
         <p>Contract <a target="_blank" href="https://${ETHEREUM_NODE_URL.includes("sepolia")? "sepolia." : ""}basescan.org/address/${CONTRACT_FAUCET_ADDRESS}"">${CONTRACT_FAUCET_ADDRESS}</a></p>
         <pre>
          ${escapeHTML(buildFrameMeta(frame))}
         </pre>
      </body>
    </html>
  `);
  } catch (error) {
    res.status(500).send(`Error message: ${error.message}`);
  }
}
