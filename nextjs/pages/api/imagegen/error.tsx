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
  const errorMsg = url.searchParams.get('errorMsg') || "Need to recast and follow before claiming.";

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
            backgroundColor: '#FAFFBD',
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
          }}
        >

          <h1
            style={{
              fontSize: 70,
              color: 'black',
              marginBottom:"20px",
            }}
          >
            {"⚠️"}
          </h1>

          <h2
            style={{
              fontSize: 30,
              color: 'black',
              margin:0,
            }}
          >
            {errorMsg}
          </h2>
          
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