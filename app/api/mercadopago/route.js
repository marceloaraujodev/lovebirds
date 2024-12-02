import { NextResponse } from "next/server";
import User from "@/app/model/user"; 
import processFormDataAndCreateUser from "@/app/utils/paymentUtils";
import uploadPhotosToFirebase from "@/app/utils/uploadToBucket"; 
import Click from "@/app/model/click";
import { mongooseConnect } from "@/app/lib/mongooseConnect";
import { siteUrl } from "@/config";
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';



import dotenv from 'dotenv';

dotenv.config();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN,
});
console.log(client);

export async function POST(req){
  await mongooseConnect();

  try {


    const formData = await req.formData();

    // console.log(formData);
    
    const name = formData.get("name");
    const date = formData.get("date");
    const time = formData.get("time");
    const musicLink = formData.get("musicLink");
    const url = formData.get("url");
    const hash = formData.get("hash");
    const message = formData.get("message");
    const preferenceId = formData.get("preferenceId");

    const preference = new Preference(client);

    console.log('this is hash', hash);


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
        external_reference: {hash: hash, name: name}, // Include the user's _id here
        back_urls: {
          success: `${siteUrl}/success`,
          failure: `${siteUrl}/failure`,
        },
        notification_url: `https://0722-2804-1b2-6043-6d70-3db9-284d-f200-6896.ngrok-free.app/api/mercadopago/webhook`,
      },
    });

    // console.log(res);

    // console.log(res.id);


  
    // const photos = [];
    // const photoFiles = formData.getAll("photos");
  
    // Upload the photos to Firebase and get the URLs
    // const uploadedPhotoURLs = await uploadPhotosToFirebase(photoFiles, hash, name); // Returns array of URLs
  
    // console.log('url , now on paymentUtils.js', `${siteUrl}/${url}`)
    // console.log({name, hash, url})
  
    // // Create a new user in the database UNCOMMENT
    // const newUser = new User({
    //   name,
    //   date,
    //   time,
    //   url,
    //   hash,
    //   photos: uploadedPhotoURLs, // Store array of URLs for the photos
    //   musicLink,
    //   paid: false,
    //   message,
    // });
  
    // await newUser.save();

    // console.log(name, date, time, url, hash, message);


    // Find the Click document and increment clicks by 1 or create it if not exists
    // await Click.findOneAndUpdate(
    //   {},  // Your criteria; leave empty if there's only one click counter document
    //   { $inc: { clicks: 1 } },
    //   { new: true, upsert: true } // `upsert` option will create the document if it doesn't exist
    // );
  
    return NextResponse.json({message: 'success', preferenceId: res.id}, {status: 200})
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({message: error.message}, {status: 500})
  }
}