import { NextResponse } from "next/server";
import User from "@/app/model/user"; 
import processFormDataAndCreateUser from "@/app/utils/paymentUtils";
import uploadPhotosToFirebase from "@/app/utils/uploadToBucket"; 
import Click from "@/app/model/click";
import { mongooseConnect } from "@/app/lib/mongooseConnect";
import { siteUrl } from "@/config";
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { MODE } from "@/config";



import dotenv from 'dotenv';

dotenv.config();

const client = new MercadoPagoConfig({
  accessToken: MODE === 'dev' ? process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN :process.env.MERCADO_PAGO_ACCESS_TOKEN,
});
// console.log(client);
// console.log('test mode', MODE === 'dev' ? process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN :process.env.MERCADO_PAGO_ACCESS_TOKEN)

export async function POST(req){
  await mongooseConnect();

  try {
    const formData = await req.formData();
    
    const name = formData.get("name");
    const date = formData.get("date");
    const time = formData.get("time");
    const musicLink = formData.get("musicLink");
    const path = formData.get("url");
    const hash = formData.get("hash");
    const message = formData.get("message");

    const preference = new Preference(client);

    // console.log('this is hash', hash);
    // console.log('this is url', path);


    const res = await preference.create({
      body: {
        payment_methods: {
          excluded_payment_methods: [{ id: "pec" }],
          excluded_payment_types: [],
          installments: 1,
        },
        items: [
          {
            title: "QR Code Love",
            quantity: 1,
            unit_price: 19.99,
          },
        ],
        // external_reference: {hash: hash, name: name}, // Include the user's _id here
        back_urls: {
          success: `${siteUrl}/${path}`,
          failure: `${siteUrl}/failure`,
        },
         auto_return: 'approved',
        // webhook route url
        notification_url:process.env.MERCADO_PAPGO_TEST_NOTIFICATION_URL,
        // const { name, date, time, url, hash } = data.metadata;
        metadata: {
          name: name,
          date: date,
          time: time,
          path: path,
          userHash: hash,
          intended_url: `${siteUrl}/${path}` // successful url redirect
        },
      },
    });

    // console.log(res);

    console.log(res.id);

    const photos = [];
    const photoFiles = formData.getAll("photos");
  
    // // Upload the photos to Firebase and get the URLs
    const uploadedPhotoURLs = await uploadPhotosToFirebase(photoFiles, hash, name); // Returns array of URLs
  
    console.log('url , now on paymentUtils.js', `${siteUrl}/${path}`)
    console.log({name, hash, path})
  
    // Create a new user in the database UNCOMMENT
    const newUser = new User({
      name,
      date,
      time,
      url: path,
      hash,
      photos: uploadedPhotoURLs, // Store array of URLs for the photos
      musicLink,
      paid: false,
      message,
    });
  
    await newUser.save();

    console.log(name, date, time, path, hash, message);


    // // Find the Click document and increment clicks by 1 or create it if not exists
    await Click.findOneAndUpdate(
      {},  // Your criteria; leave empty if there's only one click counter document
      { $inc: { clicks: 1 } },
      { new: true, upsert: true } // `upsert` option will create the document if it doesn't exist
    );
  
    return NextResponse.json({message: 'success', preferenceId: res.id}, {status: 200})
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({message: error.message}, {status: 500})
  }
}