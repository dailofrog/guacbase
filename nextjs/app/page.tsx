
import type { Metadata } from 'next'
import '../styles/globals.css';

import imgEmissionCurve from '../assets/images/emissioncurve.png';
import imgPie from '../assets/images/pie.png';
import imgGuacAnim from '../assets/images/guacanim.webp';


const links = {
  warpcast : "https://warpcast.com/",
  warpcastDailo : "hhttps://warpcast.com/dailofrog",
  twitter : "https://twitter.com/dailofrog",
  base : "https://www.base.org/",
  farcaster: "https://www.farcaster.xyz/",
  warpcastGroup: "https://warpcast.com/~/channel/guac",
  telegram: "https://t.me/guaconbase",
  lpBurnTxn : "https://basescan.org/tx/0x2eca9a6b825a3371b8387d595fe2ce9908d465b234f4d428aa7f903f9e393995",
  guacBurnTxn1 : "https://basescan.org/tx/0xde10ea13047b062479be05a89a9fcfb506cf53ffa2c7bc7e2d3113b50f47b904",
  guacBurnTxn2 : "https://basescan.org/tx/0x4e38942fc9091272ead0c899a9dba7740e906c001d06a198ad66894e33e1c8d2",
  frame : "https://warpcast.com/dailofrog/0x6cdad7cd",
  uniswap : "https://swap.defillama.com/?chain=base&from=0x0000000000000000000000000000000000000000&to=0x9A2270CC7d21Be4225d2c5C588E86C24395f77C1"
}

function Ahref({id, text}) {
  return (
    <a href={links[id]} target="_blank">{text}</a>
  )
}


const METADATA_TITLE = '🥑 $GUAC';
const METADATA_DESC = 'Free $GUAC on 🔵Base.';


export const metadata: Metadata = {
  title: METADATA_TITLE,
  description: METADATA_DESC,
  icons: {
    icon: '/favicon/favicon.ico'
  },
  openGraph: {
    title: METADATA_TITLE,
    description: METADATA_DESC,
  },
  twitter: {
    card: 'summary_large_image',
    title: METADATA_TITLE,
    description: METADATA_DESC,
    creator: '@dailofrog',
  }
};

export default function Page() {
  return (
    <>

     <div className="flex-container">

             <div className="header-container">
        <h1>🥑 $GUAC</h1>
        {/*<div className="twitter-link">
          <Ahref id="twitter" text="@dailofrog"/>
        </div>*/}
        <p>First memecoin distributed thru Farcaster Frames</p>
      </div>

      <div className="columns-container">
      <div className="column" id="col-left">

      <div className="section">

      <h2>FREE $GUAC?</h2>
      <p><strong>$GUAC</strong> is a based memecoin and the first daily faucet coin that is widely distributed towards 🔵<Ahref id="base" text="Base"/> enjoyoors via <Ahref id="farcaster" text="Farcaster"/> Frames. Distribution mechanics inspired by old school faucet coins -- who here remembers the BTC 0.01 drip?</p>
      <p>
        <img className="guacanim" src={imgGuacAnim.src} alt="GUAC Emission Curve" />
        <img className="guacanim" src={imgGuacAnim.src} alt="GUAC Emission Curve" />
        <img className="guacanim" src={imgGuacAnim.src} alt="GUAC Emission Curve" />
        </p>
      <p>The point is just to have fun while claiming some free $GUAC. I even LP'd some ETH into a V2 pool if you want to dump on me. The LP tokens are <Ahref id="lpBurnTxn" text="burnt"/> so there is at least some initial value floor to sell $GUAC into.</p>
      <p>*UPDATE*: Faucet has <a href="https://twitter.com/dailofrog/status/1755008917837627780" target="_blank">ended forever</a>.</p>
      </div>
    
      <div className="section">
          <h2>Token Info</h2>
          <ul>
        <li>Max Supply: 420M</li>
        <li>Type: ERC-20</li>
        <li>Chain: 🔵Base (Mainnet)</li>
        <li>GUAC Contract: <a target="_blank" href={`https://basescan.org/address/${process.env.CONTRACT_ADDRESS_TOKEN}`}>{process.env.CONTRACT_ADDRESS_TOKEN}</a></li>
        <li>Faucet Contract: <a target="_blank" href={`https://basescan.org/address/${process.env.CONTRACT_ADDRESS_FAUCET}`}>{process.env.CONTRACT_ADDRESS_FAUCET}</a></li>
        </ul>
        <p>Buy $GUAC:<br/><Ahref id="uniswap" text="Sushiswap"/></p>
        {/*<p>Warpcast Channel:<br/><Ahref id="warpcastGroup" text="/guac"/></p>
        <p>For you degen mfers:<br/><Ahref id="telegram" text="Telegram"/></p>*/}
        </div>


         <div className="section">
         <h2>Tokenomics</h2>
         <p>The goal of $GUAC is to be a memecoin (shitcoin) that is fair and widely distributed to the Base community via faucet mechanics. There are no unlocks, no vesting -- just one big ass faucet to claim daily. Let's have some fun.</p>
         <p>The total distribution of all 420M $GUAC:</p>
         <ul>
        <li><strong>54%</strong>: Supply Burned🔥 (<a href="#">Transaction</a>)</li>
        <li><strong>20%</strong>: LP (Uniswap V2, <Ahref id="lpBurnTxn" text="LP tokens burned"/>)</li>
        <li><strong>15%</strong>: Claimed from Faucet (<a target="_blank" href={`https://basescan.org/address/${process.env.CONTRACT_ADDRESS_FAUCET}`}>contract</a>, ended)</li>
        <li><strong>10%</strong>: Base Community Airdrop (soon)</li>
        <li><strong>1%</strong>: Team</li>
        </ul>
         <p><img className="responsive" src={imgPie.src} alt="GUAC Distribution" /></p>
         <ul>
         <li>Burn #1 (69M🔥): <Ahref id="guacBurnTxn1" text="Transaction"/></li>
         <li>Burn #2 (158M🔥): <Ahref id="guacBurnTxn2" text="Transaction"/></li>
         </ul>
        <p>I put up free liquidity into a V2 pool (<Ahref id="lpBurnTxn" text="burned all the LP tokens"/>) for you to dump $GUAC into.</p>
        </div>
        {/*
        <div className="section">
        <h2>Community (Soon)</h2>
        <p>In an effort to encourage and support 🔵Base communities and dailofrog's collectooors, we apply a slight boost to your claimable amount if you own any of these ERC721 tokens:</p>
        <ul>
          <li>Tiny Based Frogs</li>
          <li>Based Onchain Cubes</li>
          <li>Onchain Summer Flowers</li>
          <li>The End Game</li>
          <li>Based OnChain Dinos</li>
          <li>NFToshis</li>
          <li>Mochimons</li>
          <li>Based Fellas</li>
          <li>Glass Punk by PIV</li>
          <li>(<Ahref id="twitter" text="DM to request adding Base ERC721 community"/>)</li>
        </ul>
          <p>(Soon)</p>
          <p><Ahref id="twitter" text="DM @dailofrog"/> to request adding Base community</p>
        </div>
        */}
      </div>

      <div className="column" id="col-right">
         
         <div className="section">
        <h2>How do I claim $GUAC?</h2>
          <p>To claim, you simply need a <Ahref id="warpcast" text="Farcaster"/> account and to have an Ethereum wallet address connected to your account.</p>
          <p><strong>Follow these steps to claim $GUAC:</strong></p>
          <ol>
        <li>Login to <Ahref id="warpcast" text="Warpcast"/></li>
        <li>Goto <Ahref id="frame" text="@dailofrog's cast"/></li>
        <li>Press [Claim $GUAC] button within the frame</li>
        <li>Redirect to this site (guac.cool/claim), connect wallet and press button to execute txn</li>
        </ol>
        <p>If you don't have an account, <Ahref id="warpcast" text="Warpcast"/> is now free for most users.</p>
        <p><em><strong>Note</strong>: Although we'd like to be able to sponsor gas and for everyone to able to claim 100% within the Frame, unfortunately we just can't afford to pay for all the gas. For now, the onchain claim transaction must be done off Farcaster, but once they add in-Frame wallet transactions (soon hopefully), we will definitely move towards that for better UX.</em></p>
        </div>


           <div className="section">
          <h2>How does the $GUAC faucet work?</h2>
          <p>You are able to claim free $GUAC every 24-hours through the <Ahref id="frame" text="frame"/>. The point of having all of the tokens distributed within the faucet is to allow $GUAC to be spread freely, widely and gradually towards the community.</p>
          <p>The faucet follows this emission curve, with claimable amounts decreasing over time:</p>
          <p><img className="responsive" src={imgEmissionCurve.src} alt="GUAC Emission Curve" /></p>
          </div>

            <div className="section">
          <h2>Can $GUAC by sybilled?</h2>
          <p>Hopefully not, but you never know with these nerds...</p>
          <p>Claiming is done thru a signed-message system that is generated by user interactions within a Warpcast frame, account is required. Cool-off timers are also contract-enforced to prevent claiming more than once a day (<a target="_blank" href={`https://basescan.org/address/${process.env.CONTRACT_ADDRESS_FAUCET}`}>Faucet Contract</a>).</p>
          </div>

           <div className="section">
        <h2>Disclaimer</h2>
        <p><em>GUAC is a ERC-20 token created as a memecoin on the Base network, a Layer 2 solution of Ethereum. It is important for potential users and holders to understand that GUAC is not a financial security or investment. It is a fun, community-driven token with no inherent monetary value and should be treated as such. The value of GUAC, like many digital tokens, especially those considered memecoins, is highly volatile and can fluctuate widely. There is no guarantee of value, and it is possible that the value of GUAC could drop to zero. Holders should be prepared for the possibility of the value of GUAC going to zero. This token is for entertainment and community engagement purposes only and should not be considered a financial or investment instrument.</em></p>
        </div>
      </div>
      </div>
    </div>
    </>
  );
}
