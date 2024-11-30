import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import processFormDataAndCreateUser from "@/app/utils/paymentUtils";
import Click from "@/app/model/click";
import { mongooseConnect } from "@/app/lib/mongooseConnect";
import dotenv from 'dotenv';

dotenv.config();

export async function POST(req){
  await mongooseConnect();

  try {
    const formData = await req.formData();
    
    // processes all form data and creates a new user
    const {     
      name,
      date,
      time,
      url,
      hash,
      uploadedPhotoURLs,
      message} = await processFormDataAndCreateUser(formData)

      console.log(name, date, time, url, hash, message);

   // initialize 
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN,
    });

    const preference = new Preference(client);

   const res = await preference
     .create({
       body: {
         payment_methods: {
           excluded_payment_methods: [
             {
               id: 'pec',
             },
           ],
           excluded_payment_types: [],
           installments: 1,
         },
         items: [
           {
             title: 'QR Code Love',
             quantity: 1,
             unit_price: 19.99,
           },
         ],back_urls: {
           success: `${process.env.siteUrl}/success`, // Adjust URLs as needed
           failure: `${process.env.siteUrl}/failure`,
         },
         metadata: {
           name,
           date,
           time,
           url,
           hash,
         },
       },
   });

  
    // Find the Click document and increment clicks by 1 or create it if not exists
    await Click.findOneAndUpdate(
      {},  // Your criteria; leave empty if there's only one click counter document
      { $inc: { clicks: 1 } },
      { new: true, upsert: true } // `upsert` option will create the document if it doesn't exist
    );
  
    return NextResponse.json({message: 'success', preferenceId: res.id}, {status: 200})
    
  } catch (error) {
    return NextResponse.json({message: error.message}, {status: 500})
  }
}