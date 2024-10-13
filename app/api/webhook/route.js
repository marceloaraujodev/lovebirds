import { NextResponse } from 'next/server';
import { mongooseConnect } from '@/app/lib/mongooseConnect';
import Stripe from "stripe";
import User from '../../model/user';
import dotenv from 'dotenv'; 
import generateQRCode from '@/app/utils/generateQRCode'; 
import uploadImages from '@/app/utils/uploadToBucket';
import sendMail from '@/app/utils/sendEmail';
import uploadQRCodeToFireBase from '@/app/utils/uploadQRCodeToFireBase';
import { siteUrl, stripeSecretKey, stripeWebhookSecret } from '@/config'; 

dotenv.config();

// // const MODE = 'dev'  // if comment out url is production Need it for qr code generation
// const siteUrl = typeof MODE !== 'undefined' ? 'http://localhost:3000' : 'https://www.qrcodelove.com';

// instructions:
//     download stripe cli
//     cd to cli stripe folder
//     open cmd prompt type stripe login
//     confirm on the page by clicking on link in the cli window
//     change localhost if need it frontend is localhost:3000/api/webhook
//     run:
//     stripe listen --forward-to localhost:3000/api/webhook
//     request object from the webhook 
//     .metadata has all the info I sent
//     "payment_status": "paid",
//           "metadata": {
//           "date": "2024-10-01",
//           "hash": "301e142e-c400-4617-8e24-2c2f5922ddfb",
//           "time": "12:36",
//           "message": "ddddd",
//           "url": "test-E/301e142e-c400-4617-8e24-2c2f5922ddfb",
//           "name": "test E"
// },


const stripe = new Stripe(stripeSecretKey);
const endpointSecret = stripeWebhookSecret;


export async function POST (req) {
  // console.log('-----------------WEBHOOK HANDLER ----------------')
  // CHECKS IF ENDPOINTSECRET ITS WORKING
  if (!endpointSecret) {
    return NextResponse.json({ error: 'Webhook ENDPOINTSECRET is not configured' }, { status: 500 });
  }

  await mongooseConnect();
  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();
  
  let event;

  // contructs stripe event 
  try { 
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.log('there was an error', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }
  
  
  if (event.type === 'checkout.session.completed') {
    const data = event.data.object;
    const paid = data.payment_status === 'paid';

    const customerEmail = data.customer_details.email

    // Retrieve metadata from session
    const { name, date, time, url, hash } = data.metadata;
 
    if (paid) {

      try {
        // Generate QR code
        const qrcode = await generateQRCode(`${siteUrl}/${url}`);
        
        // Sends qr code url to email, hash is used to add qrcode image into same folder as the uploaded photos
        const qrCodeUrl = await uploadQRCodeToFireBase(qrcode, hash, name)

        // looks for user and updates paid to true
        const user = await User.findOneAndUpdate(
          { hash: hash }, // Query to find the user
          { 
            paid: true,   // Update the paid field
            qrCode: qrcode // Update the qrCode field
          },
          { new: true } // Return the updated document
        );

        // Email Message configuration
        const config = {
          to: customerEmail,  
          subject: `Your QR Code and Details`,
          text: `Thank you for your purchase! Here is your QR code. If image is not available copy and paste this link: ${url}`,
          html: `
            <h1>Detalhes da sua Compra</h1>
            <p>Obrigado, ${name}, por usar nossos serviços!</p>
            <p>Here are your details:</p>
            <ul>
              <li><strong>Date:</strong> ${date}</li>
              <li><strong>Time:</strong> ${time}</li>
            </ul>
            <p>Here is your QR code:</p>
            <img src="${qrCodeUrl}" alt="QR Code" />
            <p>Caso a image do QrCode não esteja aparecendo, você pode accessar a página com o link abaixo.</p>
            <p>${siteUrl}/${url}</p>
            <p>Caso deseje imprimir a imagem acesse a página e click sobre a imagem do qrcode.</p>
          `
        }
        // Send email with QR code and details 
        const email = await sendMail(config);
        console.log('Email sent successfully:', email);


      } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Failed to process the payment and upload photos.'}, { status: 500 });
      }
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });

}

