import uploadPhotosToFirebase from "@/app/utils/uploadToBucket"; 
import User from "@/app/model/user"; 
import { mongooseConnect } from "../lib/mongooseConnect";
import { siteUrl, MODE } from '@/config'; 

export default async function processFormDataAndCreateUser(formData) {
  await mongooseConnect(); 
  
  const name = formData.get("name");
  const date = formData.get("date");
  const time = formData.get("time");
  const musicLink = formData.get("musicLink");
  const url = formData.get("url");
  const hash = formData.get("hash");
  const message = formData.get("message");

  const photos = [];
  const photoFiles = formData.getAll("photos");

  // Upload the photos to Firebase and get the URLs
  // const uploadedPhotoURLs = await uploadPhotosToFirebase(photoFiles, hash, name); // Returns array of URLs

  console.log('url , now on paymentUtils.js', `${siteUrl}/${url}`)
  console.log({name, hash, url})

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

  console.log('No users being created during testing- looking for the flow only')

  return {
    name,
    date,
    time,
    url,
    hash,
    // uploadedPhotoURLs,
    message,
  };
}
