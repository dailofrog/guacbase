import { ImageResponse } from '@vercel/og';
import {RENDER_WIDTH, RENDER_HEIGHT} from './config';

export const config = {
  runtime: 'edge',
};

// Make sure the font exists in the specified path:
const fontPath = fetch(
  new URL("../../../public/JetBrainsMono-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());


export default async function (req: Request) {

  const [customFont] = await Promise.all([
    fontPath,
  ]);

  // Extract query parameters
  const url = new URL(req.url);
  //const title = url.searchParams.get('title') || "Default Title";
  //const description = (url.searchParams.get('description') || "Default Description");

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          textAlign: 'center',
          justifyContent: 'center',
          //alignItems: 'flex-end',
          //justifyContent: 'flex-start',
          position: 'relative',
        }}
      >
        <div
          style={{
            backgroundColor: '#DCFFA1',
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            //alignItems: 'flex-start',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            top: -40,
          }}
        >
          <div style={{fontSize:150, margin:0, padding:0}}>🥑
          </div>
          <h1
            style={{
              fontSize: 100,
              color: 'black',
              margin:0,
            }}
          >
            {"$GUAC"}
          </h1>

          <h2
            style={{
              fontSize: 30,
              color: 'black',
              margin:0,
            }}
          >
            {"FREE Daily Faucet on 🔵Base"}
          </h2>
          
        </div>

        <div
            style={{
              display:'block',
              backgroundColor:'black',
              color:"white",
              position:'absolute',
              bottom:0,
              width:"100%",
              padding: 10,
              fontSize: 24,
              justifyContent:"center",
 
            }}
          >
            {"by dailofrog 🐸🚬"}
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