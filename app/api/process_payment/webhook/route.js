import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
import { mongooseConnect } from '@/app/lib/mongooseConnect';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import User from '@/app/model/user';
import generateQRCode from '@/app/utils/generateQRCode';
import uploadQRCodeToFireBase from '@/app/utils/uploadQRCodeToFireBase';
import sendMail from '@/app/utils/sendEmail';
import axios from 'axios';
import { siteUrl } from '@/config';
import { MODE } from '@/config';
dotenv.config();

// use ngrok to test it ngrok http 3000 (runs on powershell)

console.log('test mode', MODE === 'dev' ? process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN :process.env.MERCADO_PAGO_ACCESS_TOKEN)

const client = new MercadoPagoConfig({
  accessToken: MODE === 'dev' ? process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN :process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

export async function POST(req) {
  await mongooseConnect();

  try {
    console.log('enter webhook ----->>>>>>>>');
    const data = await req.json();

    console.log(data);

    const { action, data: webhookData, type: typeInData } = data;
    // console.log('this is data:', data);

    if (typeInData === 'payment' && action === 'payment.created') {
      const paymentId = webhookData.id; // Get the payment ID from webhookData

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

        // is response from mercadopago payments is ok
        if (res.status === 200) {
          console.log('res from axios get webhook data:', res.data);
          // payment status
          const paymentStatus = res.data.status;
          // console.log('payment status: ⚠️---------', paymentStatus);
          const customerEmail = res.data.payer.email;
          const { user_hash, name, date, time, path: path, intended_url: intendedUrl} = res.data.metadata;

          console.log({ user_hash, customerEmail, name, date, time, path, intendedUrl });

          if (paymentStatus === 'approved') {
            console.log('set paid to true in user')
            // Generate QR code
            const qrcode = await generateQRCode(`${siteUrl}/${path}`);

            // Sends qr code url to email, hash is used to add qrcode image into same folder as the uploaded photos
            const qrCodeUrl = await uploadQRCodeToFireBase(
              qrcode,
              user_hash,
              name
            );

            // looks for user and updates paid to true
            const user = await User.findOneAndUpdate(
              { hash: user_hash }, // Query to find the user
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
              text: `Obrigado pela sua compra! Aqui está o seu QR Code. Se a imagem não estiver disponível, copie e cole este link: ${siteUrl}/${path}`,
              html: `
              <h1>Detalhes da sua Compra</h1>
              <p>Obrigado, ${name}, por usar nossos serviços!</p>
              <p>Detalhes da compra:</p>
              <ul>
                <li><strong>Date:</strong> ${date}</li>
                <li><strong>Time:</strong> ${time}</li>
              </ul>
              <p>Segue o seu QR Code:</p>
              <img src="${qrCodeUrl}" alt="QR Code" />
              <p>Caso a image do QrCode não esteja aparecendo, você pode accessar a página com o link abaixo.</p>
              <p>${siteUrl}/${path}</p>
              <p>Caso deseje imprimir a imagem acesse a página e click sobre a imagem do qrcode.</p>
             `,
            };

            // Send email with QR code and details
            const email = await sendMail(config);
            console.log('Email sent successfully:', email);
          }
          return NextResponse.redirect(intendedUrl)
        }
      } catch (error) {
        console.error(
          'Error fetching payment details:',
          error.response?.data || error.message
        );
      }
    }
    
    
    return NextResponse.json({message: 'success'}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
}


// res.data from https://api.mercadopago.com/v1/payments/{id}

// {
//   "id": 1,
//   "date_created": "2017-08-31T11:26:38.000Z",
//   "date_approved": "2017-08-31T11:26:38.000Z",
//   "date_last_updated": "2017-08-31T11:26:38.000Z",
//   "money_release_date": "2017-09-14T11:26:38.000Z",
//   "payment_method_id": "Pix",
//   "payment_type_id": "credit_card",
//   "status": "approved",
//   "status_detail": "accredited",
//   "currency_id": "BRL",
//   "description": "Pago Pizza",
//   "collector_id": 2,
//   "payer": {
//     "id": 123,
//     "email": "test_user_80507629@testuser.com",
//     "identification": {
//       "type": "CPF",
//       "number": 19119119100
//     },
//     "type": "customer"
//   },
//   "metadata": {},
//   "additional_info": {},
//   "external_reference": "MP0001",
//   "transaction_amount": 250,
//   "transaction_amount_refunded": 0,
//   "coupon_amount": 0,
//   "transaction_details": {
//     "net_received_amount": 250,
//     "total_paid_amount": 250,
//     "overpaid_amount": 0,
//     "installment_amount": 250
//   },
//   "installments": 1,
//   "card": {}
// }
