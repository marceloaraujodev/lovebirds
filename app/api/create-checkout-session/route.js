import { NextResponse } from "next/server";
import { mongooseConnect } from "@/app/lib/mongooseConnect";
import Stripe from "stripe";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { uploadPhotosToFirebase } from '@/app/utils/uploadToBucket'; 
dotenv.config();

// const MODE = 'dev'  // if comment out url is production 
// const siteUrl = typeof MODE !== 'undefined' ? 'http://localhost:3000' : 'https://www.qrcodelove.com';
// console.log(siteUrl)

// create tempo folder for files
const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp', 'uploads');


// Ensure the temporary upload directory exists
if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
  fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
}

export async function POST(req, res){
  try {
    await mongooseConnect();
    // const {name, date, time, url, hash, photos, message} = await req.json();
    // console.log('this is url:', url);

     // Read the raw body from the request
     const formData = await req.formData();

     // Extract data from formData
     const name = formData.get('name');
     const date = formData.get('date');
     const time = formData.get('time');
     const musicLink = formData.get('musicLink');
     const url = formData.get('url');
     const hash = formData.get('hash');
     const message = formData.get('message');

     const photos = [];
     const photoFiles = formData.getAll('photos');
     
    // Instead of saving locally, upload to Firebase directly
    for (const file of photoFiles) {
      const fileBuffer = await file.arrayBuffer();  // Convert File to ArrayBuffer
      const uploadedPhotoUrl = await uploadPhotosToFirebase(Buffer.from(fileBuffer), hash);  // Upload to Firebase
      photos.push(uploadedPhotoUrl);  // Store the Firebase URL
    }

     console.log('------------',{name, photos, date, time, url, hash, message, musicLink})

    //  const photosArray = JSON.parse(photos);
    //  // Upload photos to Firebase
    //  const uploadedPhotos = await uploadPhotosToFirebase(photosArray, hash);
  

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const session = await stripe.checkout.sessions.create({
      // payment_method_types: ['pix', 'card'],
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          // price: 'price_1Q4lIzBfcEidHzvrx2TlCEUc', // price test item
          price: 'price_1Q6fytBfcEidHzvrGWA63Iux', // live
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://www.qrcodelove.com/api/create-checkout-session/${url}`,
      cancel_url: `https://www.qrcodelove.com/api/create-checkout-session/error`,
      metadata: {
        name, 
        date, 
        time, 
        url, 
        hash, 
        photos, 
        musicLink,
      }
    });

    // console.log('before response')
    return NextResponse.json({
      message: 'success',
      url: session.url,
    })
    
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'error', error })
  }

}


