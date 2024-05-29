
// Based on https://github.com/coinbase/build-onchain-apps/blob/b0afac264799caa2f64d437125940aa674bf20a2/template/app/api/frame/route.ts#L13
export async function getAddrByFid(fid: number) {
  console.log("Extracting address for FID: ", fid);
  const options = {
    method: "GET",
    url: `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
    headers: {
      accept: "application/json",
      api_key: process.env.NEYNAR_API_KEY || "",
    },
  };
  console.log(`Fetching user address (fid: ${fid} from Neynar API`);
  const resp = await fetch(options.url, { headers: options.headers });
  //console.log("Response: ", resp);
  const responseBody = await resp.json(); // Parse the response body as JSON
  if (responseBody.users) {
    const userVerifications = responseBody.users[0];
    if (userVerifications.verifications) {
      /*console.log(
        "User address from Neynar API: ",
        userVerifications.verifications[0]
      );*/
      return userVerifications.verifications[0].toString();
    }
  }
  console.log("Could not fetch user address from Neynar API for FID: ", fid);
  return "0x0000000000000000000000000000000000000000";
}


// Based on https://github.com/coinbase/build-onchain-apps/blob/b0afac264799caa2f64d437125940aa674bf20a2/template/app/api/frame/route.ts#L13
export async function getUsernameByFid(fid: number) {
  console.log("Extracting username for FID: ", fid);
  const options = {
    method: "GET",
    url: `https://api.neynar.com/v2/farcaster/user?fid=${fid}`,
    headers: {
      accept: "application/json",
      api_key: process.env.NEYNAR_API_KEY || "",
    },
  };
  console.log(`Fetching user name (fid: ${fid} from Neynar API`);
  const resp = await fetch(options.url, { headers: options.headers });
  console.log("Response: ", resp);
  const responseBody = await resp.json(); // Parse the response body as JSON

  if (responseBody.user) {
    return responseBody.user.username;
  }
  
  console.log("Could not fetch user name from Neynar API for FID: ", fid);
  return null;
}

// https://docs.neynar.com/reference/validate-frame
export async function getFrameData(message: string) {

  const data = {
      "cast_reaction_context": true,
      "follow_context": true,
      "message_bytes_in_hex": message
  };

  const options = {
    method: "POST",
    url: `https://api.neynar.com/v2/farcaster/frame/validate`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      api_key: process.env.NEYNAR_API_KEY || "",
    },
    body: JSON.stringify(data)
  };

  const resp = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
      body: options.body
  });

  const responseBody = await resp.json(); // Parse the response body as JSON

  //console.log("Frame data body:", JSON.stringify(responseBody));

  return responseBody;
}