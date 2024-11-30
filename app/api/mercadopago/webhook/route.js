import { NextResponse } from "next/server";
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// use ngrok to test it ngrok http 3000 (runs on powershell)

export async function POST(req){
  console.log('enter webhook');
  
  // Obtain the x-signature value from the header
  const headers = req.headers;
  const xSignature = headers.get('x-signature');  
  const xRequestId = headers.get('x-request-id');  // The request ID sent by MercadoPago
  
  // console.log('Received headers:', xSignature, xRequestId);

  // Obtain Query params related to the request URL
  const { searchParams } = new URL(req.nextUrl)
  const dataID = searchParams.get('data.id')
  const type = searchParams.get('type')
  
//   console.log('this is url params:', dataID, type);

  // Separating the x-signature into parts
  const parts = xSignature.split(',');

  // Initializing variables to store ts and hash
  let ts;
  let hash;

  // Iterate over the values to obtain ts and v1
  parts.forEach(part => {
      // Split each part into key and value
      const [key, value] = part.split('=');
      if (key && value) {
          const trimmedKey = key.trim();
          const trimmedValue = value.trim();
          if (trimmedKey === 'ts') {
              ts = trimmedValue;
          } else if (trimmedKey === 'v1') {
              hash = trimmedValue;
          }
      }
  });

  // Obtain the secret key for the user/application from Mercadopago developers site
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

  // Generate the manifest string
  const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

  // Create an HMAC signature
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(manifest);

  // Obtain the hash result as a hexadecimal string
  const sha = hmac.digest('hex');

  if (sha === hash) {
      // HMAC verification passed
      console.log("HMAC verification passed");
      
      // send email and update user payment status
      
  } else {
      // HMAC verification failed
      console.log("HMAC verification failed");
  }

  console.log('passed all the code');

  return NextResponse.json({status: 200})
}

/* 
// NOTIFICATION STRUCTURE STYLE
{
  "id": 12345,
  "live_mode": true,
  "type": "payment",
  "date_created": "2015-03-25T10:04:58.396-04:00",
  "user_id": 44444,
  "api_version": "v1",
  "action": "payment.created",
  "data": {
      "id": "999999999"
  }
 }

 x-signature style
 v1 is the encrypted signature
 `ts=1704908010,v1=618c85345248dd820d5fd456117c2ab2ef8eda45a0282ff693eac24131a5e839`
 template id:[data.id_url];request-id:[x-request-id_header];ts:[ts_header];
*/

