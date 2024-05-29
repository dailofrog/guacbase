import { ImageResponse } from '@vercel/og';
import {RENDER_WIDTH, RENDER_HEIGHT } from './config';
import {convertSeconds, abbreviateAddress} from '../../../utils/utils';

export const config = {
  runtime: 'edge',
};

// Make sure the font exists in the specified path:
const fontPath = fetch(
  new URL("../../../public/JetBrainsMono-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());


export default async function (req: Request) {
  // Extract query parameters
  const url = new URL(req.url);

  const guacTokensClaimed: number = Number(url.searchParams.get('guacTokensClaimed')) || 0;
  const guacTotalTimesClaimed: number = Number(url.searchParams.get('guacTotalTimesClaimed')) || 0;
  const guacMaxSupply: number = Number(url.searchParams.get('guacMaxSupply')) || 0;

  const userAddress: string | null = url.searchParams.get('userAddress') || null;
  const userEns: string | null = url.searchParams.get('userEns') || null;
  const userDisplayName: string | null = url.searchParams.get('userDisplayName') || null;
  const userTokensClaimed: number = Number(url.searchParams.get('userTokensClaimed')) || 0;
  const userClicks: number = Number(url.searchParams.get('userClicks')) || 0;
  const userBoosts: number = Number(url.searchParams.get('userBoosts')) || 0;

  const userAmountClaimable: number = Number(url.searchParams.get('userAmountClaimable')) || 0;
  const userAmountCooldownSecs: number = Number(url.searchParams.get('userAmountCooldownSecs')) || 0;
  const userAmountJustClaimed: number = Number(url.searchParams.get('userAmountJustClaimed')) || 0;

  const chain = "🔵Base";

  const [customFont] = await Promise.all([
    fontPath,
  ]);


  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          textAlign: 'center',
          //justifyContent: 'center',
          //alignItems: 'flex-end',
          //justifyContent: 'flex-start',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        />


        {/* left column*/}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            //alignItems: 'flex-start',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backgroundColor:'green',
            fontSize:"1.5em",
          }}
        >
          <h1
            style={{
              fontSize: "2em",
              color: 'white',
              margin:"10px",
            }}
          >
            🥑$GUAC Faucet
          </h1>

          <div style={{
            display:"flex",
            backgroundColor:"#DCFFA1",
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign:"left",
            padding: "10px",
            border: "1px solid black",
            width:"90%",
            margin: "10px",
          }}>
            <p style={{margin:0}}>🥑 Total Claimed: {guacTokensClaimed}</p>
            <p style={{margin:0}}>🥑 Max Claimable: {(guacMaxSupply / 1000000).toFixed(1)}M</p>
            <p style={{margin:0}}>🥑 Total Clicks: {guacTotalTimesClaimed}</p>
            <p style={{margin:0}}>⛓️ Chain: {chain}</p>
          </div>

          {userAddress && <div style={{
            display:"flex",
            backgroundColor:"#DCFFA1",
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign:"left",
            padding: "10px",
            border: "1px solid black",
            width:"90%",
            margin: "10px",

          }}>
            <p style={{margin:"0 0 10px 0"}}>{userDisplayName || "You"}: </p>
            <p style={{margin:0}}>🟢 {userEns || abbreviateAddress(userAddress)}</p>
            <p style={{margin:0}}>🥑 Claimed: {userTokensClaimed} $GUAC</p>
            <p style={{margin:0}}>🖱️ Clicks: {userClicks}</p>
            <p style={{margin:0}}>🔥 Boost: +{Math.round(userBoosts*100-100)}%</p>
          </div>}
        </div>


         {/* riight column*/}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backgroundColor:'white',
            flex:"1",
          }}
        >

           {userAmountJustClaimed > 0 && <p
            style={{
              fontSize: 25,
              color: 'black',
              margin:"0",
              backgroundColor: "yellow",
              padding: "0.5em",
            }}
          >
            *You just claimed {userAmountJustClaimed} $GUAC!*
          </p>}

            <h1
            style={{
              fontSize: 80,
              color: 'black',
              marginBottom: "30px",
            }}
          >
            🥑🥑🥑
          </h1>

          {userAmountCooldownSecs==0 && <h1
            style={{
              fontSize: 40,
              color: 'black',
              margin:0,
            }}
          >
            You can claim:
          </h1>}

          {userAmountCooldownSecs==0 && <h2
            style={{
              fontSize: 65,
              color: 'green',
              margin:0,
            }}
          >
            {userAmountClaimable} $GUAC
          </h2>}

           <p
            style={{
              fontSize: 25,
              color: 'black',
              margin:"40px 0 0 0"
            }}
          >
            Time until claimable: 
          </p>

          <p
            style={{
              fontSize: 25,
              color: 'black',
              margin: 0,
            }}
          >
             {userAmountCooldownSecs==0 ? "NOW!" : convertSeconds(userAmountCooldownSecs)}
          </p>

        </div>


      </div>
    ),
    { 
      width:RENDER_WIDTH, 
      height:RENDER_HEIGHT, 
      emoji:"noto",
      fonts: [
          {
            name: "Custom Font",
            data: customFont,
            style: "normal",
            weight: 400,
          },
        ],
    } 
  );
}