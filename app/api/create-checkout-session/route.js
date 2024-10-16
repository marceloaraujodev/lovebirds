import { NextResponse } from "next/server";
import { mongooseConnect } from "@/app/lib/mongooseConnect";
import User from '../../model/user';
import Stripe from "stripe";
import uploadPhotosToFirebase from "@/app/utils/uploadToBucket";
import dotenv from 'dotenv';
import { siteUrl, stripeSecretKey, MODE } from '@/config'; 

dotenv.config();


export async function POST(req, res){
  try {
    await mongooseConnect();
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

     console.log('this is name create chekcout route', name)



    // Upload the photos to Firebase and get the URLs
    const uploadedPhotoURLs = await uploadPhotosToFirebase(photoFiles, hash, name); // array of strings is the result   
    // console.log('Uploaded photo URLs:', uploadedPhotoURLs);


    console.log('url entering stripe', `${siteUrl}/${url}`)
    console.log({name, hash, url})
    
    const stripe = new Stripe(stripeSecretKey)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      line_items: [
        {
          // price: 'price_1Q4lIzBfcEidHzvrx2TlCEUc', // test product
          // price: price_1Q7lUkBfcEidHzvr414JsEG4', // new price 19.99
          // price: 'price_1Q6fytBfcEidHzvrGWA63Iux', // live
          price: MODE === 'dev' ? 'price_1Q4lIzBfcEidHzvrx2TlCEUc' : 'price_1Q6fytBfcEidHzvrGWA63Iux',
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true, 
      success_url: `${siteUrl}/${url}`,
      cancel_url: `${siteUrl}/error`,
      metadata: {
        name, 
        date, 
        time, 
        url, 
        hash, 
        // musicLink,
        // photos, 
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

    return NextResponse.json({
      message: 'success',
      url: session.url,
    })
    
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'error', error })
  }

}


