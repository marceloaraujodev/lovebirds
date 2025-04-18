import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
import { mongooseConnect } from '@/app/lib/mongooseConnect';
import { MercadoPagoConfig } from 'mercadopago';
import User from '@/app/model/user';
import generateQRCode from '@/app/utils/generateQRCode';
import uploadQRCodeToFireBase from '@/app/utils/uploadQRCodeToFireBase';
import sendMail from '@/app/utils/sendEmail';
import axios from 'axios';
import { siteUrl } from '@/config';
import { MODE } from '@/config';
import bcrypt from 'bcrypt';
dotenv.config();
import { randomBytes } from 'crypto';

export const generatePassword = () => {
  return randomBytes(12).toString('hex'); // Generates a 24-character password
};

const generateHashedPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// use ngrok to test it ngrok http 3000 (runs on powershell)

console.log(
  'test mode or live mode and should display accesstoken',
  MODE === 'dev'
    ? process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN
    : process.env.MERCADO_PAGO_ACCESS_TOKEN
);

const client = new MercadoPagoConfig({
  accessToken:
    MODE === 'dev'
      ? process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN
      : process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

export async function POST(req) {
  await mongooseConnect();

    console.log('enter webhook ----->>>>>>>>');
    const data = await req.json();

    console.log('this is data from webhook: ', data);

    const { action, data: webhookData, type: typeInData } = data;
    // console.log('this is data:', data);

    if (
      typeInData === 'payment' &&
      (action === 'payment.created' || action === 'payment.updated')
     ) {
      // if (typeInData === 'payment' && action === 'payment.created'){
      const paymentId = webhookData.id; // Get the payment ID from webhookData
      console.log('this is paymentId:------------', paymentId);

      // Get payment details using Mercado Pago API
      try {
        // get payment details
        const res = await axios.get(
          `https://api.mercadopago.com/v1/payments/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${
                MODE === 'dev'
                  ? process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN
                  : process.env.MERCADO_PAGO_ACCESS_TOKEN
              }`,
            },
          }
        );

        // is response from mercadopago payments is ok
        if (res.status === 200) {
          console.log('res from axios get webhook data:', res.data);
          // payment status
          const paymentStatus = res.data.status;
          console.log('payment status: ⚠️---------', paymentStatus);

          if(paymentStatus === 'pending') return NextResponse.json({message: 'Payment is pending, returning'}, {status: 200})

          const {
            user_hash,
            name,
            date,
            time,
            email: customerEmail,
            path: path,
          } = res.data.metadata;

          console.log('this is customer email from metadata:---------------', customerEmail);

          if (paymentStatus === 'approved') {
            console.log('set paid to true in user');

            // Generate QR code
            const qrcode = await generateQRCode(`${siteUrl}/${path}`);

            // Sends qr code url to email, hash is used to add qrcode image into same folder as the uploaded photos
            const qrCodeUrl = await uploadQRCodeToFireBase(
              qrcode,
              user_hash,
              name
            );

            const generatedPassword = generatePassword();
            const hashedPassword = await generateHashedPassword(generatedPassword);

            // looks for user and updates paid to true
            const user = await User.findOneAndUpdate(
              { hash: user_hash }, // Query to find the user
              {
                paid: true, // Update the paid field
                qrCode: qrcode, // Update the qrCode field
                // password: hashedPassword // add it later
              },
              { new: true } // Return the updated document
            );

            const formattedTime = new Intl.DateTimeFormat('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            }).format(new Date());

            const formattedDate = new Intl.DateTimeFormat('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }).format(new Date()); 

            // Email Message configuration
            // <li><strong>Password:</strong> ${generatedPassword}</li>
            const config = {
              to: customerEmail,
              subject: `Seu Qr Code e detalhes de sua compra.`,
              text: `Obrigado pela sua compra! Aqui está o seu QR Code. Se a imagem não estiver disponível, copie e cole este link: ${siteUrl}/${path}`,
              html: `
              <h1>Detalhes da sua Compra</h1>
              <p>Obrigado, ${name}, por usar nossos serviços!</p>
              <p>Detalhes da compra:</p>
              <ul>
                <li><strong>Date:</strong> ${formattedDate}</li>
                <li><strong>Time:</strong> ${formattedTime}</li>
                
              </ul>
              <p>Segue o seu QR Code:</p>
              <img src="${qrCodeUrl}" alt="QR Code" />
              <p>Caso a imagem do QrCode não esteja aparecendo, você pode acessar a página com o link abaixo.</p>
              <p>${siteUrl}/${path}</p>
              <p>Caso deseje imprimir a imagem acesse a página e click sobre a imagem do qrcode.</p>
             `,
            };

            const messageForMyself = {
              to: 'marcelosurfer@gmail.com',
              subject: `Tirar dinheiro do mercado pago urgente`,
              text: `Nova compra no qrcodelove, tirar dinheiro do mercado pago urgente`,
              html: `
              <h1>Sacar grana do mercado pago</h1>
             `,
            }


            // Send email with QR code and details
            const email = await sendMail(config);
            console.log('Email sent successfully:', email);

            await sendMail(messageForMyself);


            return NextResponse.json({message: 'success'}, {status: 200});
          }
          
          return NextResponse.json({message: 'success'}, {status: 200});
        } 
      } catch (error) {
        if(error.response && error.response.status === 404) {
          console.warn(`Payment not found: Payment ID ${paymentId}`);
          return NextResponse.json(
            { message: 'Payment not found' },
            { status: 200 }
          );
        }

        console.error('Error fetching payment details:', error.message);
        return NextResponse.json(
          { message: 'An error occurred while processing the payment.' },{status: 200}
        );
      }
    }
    return NextResponse.json({message: 'success'}, {status: 200});
}
