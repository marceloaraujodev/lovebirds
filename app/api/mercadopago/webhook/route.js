import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { mongooseConnect } from '@/app/lib/mongooseConnect';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import axios from 'axios';
dotenv.config();

// use ngrok to test it ngrok http 3000 (runs on powershell)

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN,
});

export async function POST(req) {
  await mongooseConnect();

  try {
    console.log('enter webhook ----->>>>>>>>');
    const data = await req.json();

    const { action, data: webhookData, type: typeInData } = data;
    console.log('this is data:', data);

    if (typeInData === 'payment' && action === 'payment.created') {
      const paymentId = webhookData.id; // Get the payment ID from webhookData
      console.log('Payment ID:', paymentId);

      // Get payment details using Mercado Pago API
      try {
        const res = await axios.get(
          `https://api.mercadopago.com/v1/payments/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN}`,
            },
          }
        );

        console.log('res from axios get webhook data:', res);
        //inside res  external_reference: '{"hash":"554e6523-d74a-4145-b5e9-05a9a4e66a78","name":"test"}'
        const {userHash, couplesName } = res.data.external_reference
        console.log(res.data.external_reference)
        
      } catch (error) {
        console.error(
          'Error fetching payment details:',
          error.response?.data || error.message
        );
      }
    }

    // Obtain the x-signature value from the header
    const headers = req.headers;
    const xSignature = headers.get('x-signature');
    const xRequestId = headers.get('x-request-id'); // The request ID sent by MercadoPago

    // console.log('headers', headers);
    // console.log('Received headers, compare those with :', xSignature, xRequestId);

    // Obtain Query params related to the request URL
    const { searchParams } = new URL(req.Url);
    const dataID = searchParams.get('data.id');
    const type = searchParams.get('type')
    // console.log('this is search params', searchParams)
    // console.log('this is url params:', dataID, type);

    // Separating the x-signature into parts
    const parts = xSignature.split(',');

    // Initializing variables to store ts and hash
    let ts;
    let hash;

    // Iterate over the values to obtain ts and v1
    parts.forEach((part) => {
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
    //   console.log(secret);
    //   console.log('hmac:', hmac);
    // Obtain the hash result as a hexadecimal string
    const sha = hmac.digest('hex');

    //   console.log('sha === hmac', sha === hmac);

    //     console.log('Manifest:', manifest);
    //     console.log('Computed hash (sha):', sha);
    //     console.log('Received hash (v1):', hash);
    //     console.log('Webhook secret:', secret);
    //     console.log('TS from header:', ts);

    if (sha === hash) {
      // HMAC verification passed
      console.log('HMAC verification passed');
      if (type === 'payment') {
        console.log('enter payment updated');
        // grap metadata from item and use the hash to find user and change paid to true
        // send email and update user payment status
      }
    } else {
      // HMAC verification failed
      console.log('HMAC verification failed');
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
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

// // url after payment that links back to the site
// success?collection_id=94966577742&collection_status=approved&payment_id=94966577742&status=approved&external_reference=null&payment_type                                                                                                      e=credit_card&merchant_order_id=25616455030&preference_id=1622982866-ca1247c6-e723-498d-9154-0e1cece30731&site_id=MLB&processing_mode=aggregator&merchant_account_id=null
