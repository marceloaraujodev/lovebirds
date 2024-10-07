import { NextResponse } from 'next/server';
import { mongooseConnect } from '@/app/lib/mongooseConnect';
import Stripe from "stripe";
import User from '../../model/user';
import dotenv from 'dotenv'; 
import generateQRCode from '@/app/utils/generateQRCode'; 
import uploadImages from '@/app/utils/uploadToBucket';
import sendMail from '@/app/utils/sendEmail';
import uploadQRCodeToFireBase from '@/app/utils/uploadQRCodeToFireBase';
import { removePhotosFromBucket } from '@/app/utils/removePhotosFromBucket';

dotenv.config();

const MODE = 'dev'  // if comment out url is production Need it for qr code generation
const siteUrl = typeof MODE !== 'undefined' ? 'http://localhost:3000' : 'https://www.qrcodelove.com';
console.log(siteUrl)

/* 
 /// instructions:
    download stripe cli
    cd to cli stripe folder
    open cmd prompt type stripe login
    confirm on the page by clicking on link in the cli window
    change localhost if need it frontend is localhost:3000/api/webhook
    run:
    stripe listen --forward-to localhost:3000/api/webhook

    request object from the webhook 
    .metadata has all the info I sent
    "payment_status": "paid",
          "metadata": {
          "date": "2024-10-01",
          "hash": "301e142e-c400-4617-8e24-2c2f5922ddfb",
          "time": "12:36",
          "message": "ddddd",
          "url": "test-E/301e142e-c400-4617-8e24-2c2f5922ddfb",
          "name": "test E"
  },
*/


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;

// console.log('ENDPOINT SECRET: ', endpointSecret);

export async function POST (req) {
  console.log('-----------------WEBHOOK HANDLER ----------------')
  // CHECKS IF ENDPOINTSECRET ITS WORKING
  if (!endpointSecret) {
    // console.error('STRIPE_WEBHOOK_ENDPOINT_SECRET is not set');
    return NextResponse.json({ error: 'Webhook ENDPOINTSECRET is not configured' }, { status: 500 });
  }

  await mongooseConnect();
  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();
  // console.log('Raw body:', rawBody.toString());
  
  let event;

  // contructs stripe event 
  try { 
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    // console.log('event', event)
  } catch (err) {
    console.log('there was an error', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log('AFTER EVENT TRY BLOCK')
  
  // Handle the event
  // switch (event.type) {
  //   case 'checkout.session.completed':
  //     const data = event.data.object;
  //     const paid = data.payment_status === 'paid';

  //     // create a qr code for the url - will be used to send the email
  //     const qrcode = await generateQR(`http://localhost:3000/${url}`);

  //     // gets details from metadata which is passed in the create checkout session
  //     const { name, date, time, url, hash, message, photos } = data.metadata;
  //     const photosArray = JSON.parse(photos);
  //     // console.log('this should be Data', data)

  //     // create user when payment is successful
  //     if(paid){
  //       console.log('IF PAID THIS WILL RUN')
  //       const user = new User({
  //         name,
  //         date,
  //         time,
  //         url,
  //         hash, 
  //         photos,
  //         paid: true, 
  //         message
  //       });
          
  //           await user.save();
  //           console.log('User saved successfully', user)

  //     }
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  if (event.type === 'checkout.session.completed') {
    console.log('ENTER CHECKOUT.SESSION.COMPLIETED')
    const data = event.data.object;
    const paid = data.payment_status === 'paid';

    console.log('email ------>>>>>>>>>>>>>',data.customer_details.email)
    const customerEmail = data.customer_details.email

    // Retrieve metadata from session
    const { name, date, time, url, hash, photos } = data.metadata;
 
    if (paid) {
      console.log('Payment successful, processing photos and saving user data.');
      // const photosArray = JSON.parse(photos); // turns string array from metatada to a real array
      try {
        // Generate QR code
        const qrcode = await generateQRCode(`${siteUrl}/${url}`);
        
        // Goes to email and hash is used to put the qrcode image into the same foder as the uploaded photos
        const qrCodeUrl = await uploadQRCodeToFireBase(qrcode, hash)

        console.log('PHOTOS BEFORE SAVED TO DB--------->>>>', photos)

        // looks for user and updates paid to true
        const user = await User.findOne({ hash: hash})
        user.paid = true;
        user.qrCode = qrcode,
        await user.save();
        console.log(user)

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
            <p>Caso a image do QrCode não esteja aparecendo, você pode accessar com o link abaixo:</p>
            <p>${siteUrl}/${url}</p>
          `
        }
        // Send email with QR code and details 
        await sendMail(config);


      } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Failed to process the payment and upload photos.'}, { status: 500 });
      }
    }
  }

  console.log('THIS IS EVENT TYPE AT THE END', event.type)

  return NextResponse.json({ success: true }, { status: 200 });

}

