import { NextResponse } from "next/server";
import { mongooseConnect } from "@/app/lib/mongooseConnect";
import Stripe from "stripe";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { FaDiagramSuccessor } from "react-icons/fa6";
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
  // try {
  //   await mongooseConnect();
  //   // const {name, date, time, url, hash, photos, message} = await req.json();
  //   // console.log('this is url:', url);

  //    // Read the raw body from the request
  //    const formData = await req.formData();

  //    // Extract data from formData
  //    const name = formData.get('name');
  //    const date = formData.get('date');
  //    const time = formData.get('time');
  //    const musicLink = formData.get('musicLink');
  //    const url = formData.get('url');
  //    const hash = formData.get('hash');
  //    const message = formData.get('message');

  //    const photos = [];
  //    const photoFiles = formData.getAll('photos');
     
  //     // Store uploaded files temporarily
  //     for (const file of photoFiles) {
  //       const filePath = path.join(TEMP_UPLOAD_DIR, file.name); // Create a unique file path
  //       const fileBuffer = await file.arrayBuffer(); // Convert File to ArrayBuffer
  //       fs.writeFileSync(filePath, Buffer.from(fileBuffer)); // Save the file to the temporary directory
  //       photos.push(file.name); // Store the name for reference later
  //     }

  //   console.log(JSON.stringify(photos));
  //    console.log('------------',{name, photos, date, time, url, hash, message, musicLink})
  

  //   // // send qrcode to user email
  //   // const transporter = nodemailer.createTransport({
  //   //   service: 'gmail',
  //   //   auth: {
  //   //     user: process.env.GMAIL_USER,
  //   //     pass: process.env.GMAIL_PASSWORD
  //   //   }
  //   // });

  //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  //   const session = await stripe.checkout.sessions.create({
  //     // payment_method_types: ['pix', 'card'],
  //     line_items: [
  //       {
  //         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
  //         // price: 'price_1Q4lIzBfcEidHzvrx2TlCEUc', // price test item
  //         price: 'price_1Q6fytBfcEidHzvrGWA63Iux', // live
  //         quantity: 1,
  //       },
  //     ],
  //     mode: 'payment',
  //     success_url: `https://www.qrcodelove.com/api/create-checkout-sessiony/${url}`,
  //     cancel_url: `${siteUrl}/error`,
  //     metadata: {
  //       name, 
  //       date, 
  //       time, 
  //       url, 
  //       hash, 
  //       photos, 
  //       musicLink,
  //       message, 
  //       photos: JSON.stringify(photos), // Store file names
  //        // Pass relevant data as metadata
  //     }
  //   });

  //   // console.log('before response')
  //   return NextResponse.json({
  //     message: 'success',
  //     url: session.url,
  //   })
    
  // } catch (error) {
  //   console.log(error)
  //   return NextResponse.json({ message: 'error', error })
  // }

  NextResponse.json({ success: true})
}


