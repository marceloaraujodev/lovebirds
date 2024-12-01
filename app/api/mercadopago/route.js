import { NextResponse } from "next/server";
import User from "@/app/model/user"; 
import processFormDataAndCreateUser from "@/app/utils/paymentUtils";
import uploadPhotosToFirebase from "@/app/utils/uploadToBucket"; 
import Click from "@/app/model/click";
import { mongooseConnect } from "@/app/lib/mongooseConnect";
import { siteUrl } from "@/config";
import dotenv from 'dotenv';

dotenv.config();
// console.log(process.env.siteUrl);


export async function POST(req){
  await mongooseConnect();

  try {
    const formData = await req.formData();

    console.log(formData);
    
    const name = formData.get("name");
    const date = formData.get("date");
    const time = formData.get("time");
    const musicLink = formData.get("musicLink");
    const url = formData.get("url");
    const hash = formData.get("hash");
    const message = formData.get("message");
    const preferenceId = formData.get("preferenceId");

    console.log(preferenceId);
  
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
  
    return NextResponse.json({message: 'success'}, {status: 200})
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({message: error.message}, {status: 500})
  }
}