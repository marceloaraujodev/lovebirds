import { NextResponse } from 'next/server';
import { mongooseConnect } from '@/app/lib/mongooseConnect';
import Stripe from 'stripe';
import User from '../../model/user';
import dotenv from 'dotenv';
import generateQRCode from '@/app/utils/generateQRCode';
import sendMail from '@/app/utils/sendEmail';
import uploadQRCodeToFireBase from '@/app/utils/uploadQRCodeToFireBase';
import { siteUrl, stripeSecretKey, stripeWebhookSecret } from '@/config';

dotenv.config();

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

export async function POST(req) {
  console.log('Enter webhook ---->>>>>');
  // CHECKS IF ENDPOINTSECRET ITS WORKING
  if (!endpointSecret) {
    return NextResponse.json(
      { error: 'Webhook ENDPOINTSECRET is not configured' },
      { status: 500 }
    );
  }

  await mongooseConnect();
  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();

  let event;

  // contructs stripe event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.log('there was an error', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  console.log(event.type);
  if (event.type === 'checkout.session.completed') {
    const data = event.data.object;
    const paid = data.payment_status === 'paid';

    const customerEmail = data.customer_details.email;

    // Retrieve metadata from session
    const { name, date, time, url, hash } = data.metadata;

    if (paid) {
      try {
        // Generate QR code
        const qrcode = await generateQRCode(`${siteUrl}/${url}`);

        // Sends qr code url to email, hash is used to add qrcode image into same folder as the uploaded photos
        const qrCodeUrl = await uploadQRCodeToFireBase(qrcode, hash, name);

        // looks for user and updates paid to true
        const user = await User.findOneAndUpdate(
          { hash: hash }, // Query to find the user
          {
            paid: true, // Update the paid field
            qrCode: qrcode, // Update the qrCode field
          },
          { new: true } // Return the updated document
        );

        // Email Message configuration
        const config = {
          to: customerEmail,
          subject: `Seu Qr Code e detalhes de sua compra.`,
          text: `Obrigado pela sua compra! Aqui está o seu QR Code. Se a imagem não estiver disponível, copie e cole este link: ${url}`,
          html: `
            <h1>Detalhes da sua Compra</h1>
            <p>Obrigado, ${name}, por usar nossos serviços!</p>
            <p>Detalhes de sua compra:</p>
            <ul>
              <li><strong>Data:</strong> ${date}</li>
              <li><strong>Hora:</strong> ${time}</li>
            </ul>
            <p>Segue o seu QR code:</p>
            <img src="${qrCodeUrl}" alt="QR Code" />
            <p>Caso a image do QrCode não esteja aparecendo, você pode accessar a página com o link abaixo.</p>
            <p>${siteUrl}/${url}</p>
            <p>Caso deseje imprimir a imagem acesse a página e click sobre a imagem do qrcode.</p>
          `,
        };
        // Send email with QR code and details
        const email = await sendMail(config);
        console.log('Email sent successfully:', email);
      } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json(
          { error: 'Failed to process the payment and upload photos.' },
          { status: 500 }
        );
      }
    }
  }

  // Boleto Handle payment_intent.succeeded event for boleto
  if (event.type === 'checkout.session.async_payment_succeeded') {
    console.log('Enter Boleto payment successfull');
    // logic goes here no need for other if statements

    const data = event.data.object;

    console.log(data);
    console.log('above is data:');

    const customerEmail = data.customer_details.email;

    const { name, date, time, url, hash } = data.metadata;

    try {
      // Generate QR code for Boleto
      const qrcode = await generateQRCode(`${siteUrl}/${url}`);

      // Upload QR code to Firebase
      const qrCodeUrl = await uploadQRCodeToFireBase(qrcode, hash, name);

      // Look for the user and update paid to true
      const user = await User.findOneAndUpdate(
        { hash: hash }, // Query to find the user
        {
          paid: true, // Update the paid field
          qrCode: qrcode, // Update the qrCode field
        },
        { new: true } // Return the updated document
      );

      // Send email with QR code and details
      const config = {
        to: customerEmail,
        subject: `Seu Qr Code e detalhes de sua compra.`,
        text: `Obrigado pela sua compra! Aqui está o seu QR Code. Se a imagem não estiver disponível, copie e cole este link: ${url}`,
        html: `
            <h1>Detalhes da sua Compra</h1>
            <p>Obrigado, ${name}, por usar nossos serviços!</p>
            <p>Detalhes de sua compra:</p>
            <ul>
              <li><strong>Data:</strong> ${date}</li>
              <li><strong>Hora:</strong> ${time}</li>
            </ul>
            <p>Segue o seu QR code:</p>
            <img src="${qrCodeUrl}" alt="QR Code" />
            <p>Caso a image do QrCode não esteja aparecendo, você pode accessar a página com o link abaixo.</p>
            <p>${siteUrl}/${url}</p>
            <p>Caso deseje imprimir a imagem acesse a página e click sobre a imagem do qrcode.</p>
          `,
      };

      // Send the email
      const email = await sendMail(config);
      console.log('Email sent successfully:', email);
    } catch (error) {
      console.error('Error processing Boleto payment:', error);
      return NextResponse.json(
        { error: 'Failed to process the Boleto payment and upload photos.' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

// response from boleto webhook after is paid below id the data object
// Enter Boleto payment successfull
// {
//   id: 'cs_test_b1LY8wY5yCX0OYvAC9ZpfhdynrX6KNHOvvLoABKZLPdXYgDJvn70cCKIg5',
//   object: 'checkout.session',
//   adaptive_pricing: { enabled: false },
//   after_expiration: null,
//   allow_promotion_codes: true,
//   amount_subtotal: 1599,
//   amount_total: 1599,
//   automatic_tax: { enabled: false, liability: null, status: null },
//   billing_address_collection: null,
//   cancel_url: 'http://localhost:3000/error',
//   client_reference_id: null,
//   client_secret: null,
//   consent: null,
//   consent_collection: null,
//   created: 1733328837,
//   currency: 'brl',
//   currency_conversion: null,
//   custom_fields: [],
//   custom_text: {
//     after_submit: null,
//     shipping_address: null,
//     submit: null,
//     terms_of_service_acceptance: null
//   },
//   customer: null,
//   customer_creation: 'if_required',
//   customer_details: {
//     address: {
//       city: 'Abdon Batista',
//       country: 'BR',
//       line1: 'Rua Miguel Matte, 834',
//       line2: 'Apt 204D',
//       postal_code: '88331-030',
//       state: 'SC'
//     },
//     email: 'fulaninho@example.com',
//     name: 'Marcelo Correa Araujo',
//     phone: null,
//     tax_exempt: 'none',
//     tax_ids: []
//   },
//   customer_email: null,
//   expires_at: 1733415237,
//   invoice: null,
//   invoice_creation: {
//     enabled: false,
//     invoice_data: {
//       account_tax_ids: null,
//       custom_fields: null,
//       description: null,
//       footer: null,
//       issuer: null,
//       metadata: {},
//       rendering_options: null
//     }
//   },
//   livemode: false,
//   locale: null,
//   metadata: {
//     hash: 'b91a1fa8-e4a5-4b95-91ec-99a5dea68278',
//     date: '2024-12-04',
//     time: '13:14',
//     url: 'test/b91a1fa8-e4a5-4b95-91ec-99a5dea68278',
//     name: 'test'
//   },
//   mode: 'payment',
//   payment_intent: 'pi_3QSLDqBfcEidHzvr1of4A3Ia',
//   payment_link: null,
//   payment_method_collection: 'if_required',
//   payment_method_configuration_details: null,
//   payment_method_options: {},
//   payment_method_types: [ 'card', 'boleto' ],
//   payment_status: 'paid',
//   phone_number_collection: { enabled: false },
//   recovered_from: null,
//   saved_payment_method_options: null,
//   setup_intent: null,
//   shipping_address_collection: null,
//   shipping_cost: null,
//   shipping_details: null,
//   shipping_options: [],
//   status: 'complete',
//   submit_type: null,
//   subscription: null,
//   success_url: 'http://localhost:3000/test/b91a1fa8-e4a5-4b95-91ec-99a5dea68278',
//   total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
//   ui_mode: 'hosted',
//   url: null
// }
// above is data:
