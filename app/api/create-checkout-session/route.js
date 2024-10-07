import { NextResponse } from "next/server";
import { mongooseConnect } from "@/app/lib/mongooseConnect";
import User from '../../model/user';
import Stripe from "stripe";
import uploadPhotosToFirebase from "@/app/utils/uploadToBucket";
import dotenv from 'dotenv';


dotenv.config();


//// this is the file from photos
// [
//   File {
//     size: 440915,
//     type: 'image/jpeg',
//     name: 'img1.jpg',
//     lastModified: 1728182106381
//   },
//   File {
//     size: 160272,
//     type: 'image/jpeg',
//     name: 'img3.jpg',
//     lastModified: 1728182106383
//   }
// ]

const MODE = 'dev'  // if comment out url is production 
const siteUrl = typeof MODE !== 'undefined' ? 'http://localhost:3000' : 'https://www.qrcodelove.com';
// console.log(siteUrl)

export async function POST(req, res){
  try {
    await mongooseConnect();
     // Read the raw body from the request
     const formData = await req.formData();

     console.log('this is formdata', formData)

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
    //  console.log('------photofiles', photoFiles)
     
     // Upload the photos to Firebase and get the URLs
     console.log('BEFORE SENDING FILES TO Firebase')
    const uploadedPhotoURLs = await uploadPhotosToFirebase(photoFiles, hash); // array of strings is the result
    // console.log('uploadedPhotosURls ----', uploadedPhotoURLs) // this should be the photos in the 

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1Q4lIzBfcEidHzvrx2TlCEUc', // price test item
          // price: 'price_1Q6fytBfcEidHzvrGWA63Iux', // live
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/${url}`,
      cancel_url: `${siteUrl}/error`,
      metadata: {
        name, 
        date, 
        time, 
        url, 
        hash, 
        photos, 
        musicLink,
        message, 
        photos: JSON.stringify(uploadedPhotoURLs), // Store file names
         // Pass relevant data as metadata
      }
    });

    // Create a new user in the database
    const newUser = new User({
      name,
      date,
      time,
      url,
      hash,
      photos: uploadedPhotoURLs,  // Store array of URLs for the photos
      musicLink,
      paid: false,
      message,
    });

    await newUser.save();

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


