// pages/api/game.ts

import type { NextApiRequest, NextApiResponse } from 'next';

import { getTimestampedImageUrl } from '../../utils/utils';
import { Frame, buildFrameMeta, buildFrameDebugHtml } from '../../utils/frame';

import imgStartScreen from '../../assets/images/startscreen.png';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const baseUrl = process.env.API_SERVER;

  // default: show starting page
  let ogImageUrl = `${baseUrl}/api/imagegen/start?title=${encodeURIComponent("TITLE")}&description=${encodeURIComponent("DESCR")}`;
  ogImageUrl = imgStartScreen.src;//getTimestampedImageUrl(ogImageUrl);


  const frame: Frame = {
    img: ogImageUrl,
    //buttons: [{ label: "🥑 Let's rock this $GUAC" }],
    buttons: [{ label: "🥑 Faucet has ended" }],
    //posturl: `api/mine`,
    posturl: `api/claim`,
  };


  try {

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
      </body>
    </html>
  `);
  } catch (error) {
    res.status(500).send("Error message");
  }
}
