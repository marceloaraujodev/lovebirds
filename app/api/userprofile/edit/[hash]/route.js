import { NextResponse } from "next/server";
import User from "@/app/model/user";
import { mongooseConnect } from "@/app/lib/mongooseConnect";
import uploadImages from "@/app/utils/uploadToBucket";

export async function PATCH(req, { params }){
  try {
    mongooseConnect();
    // using the hash as the userId
    const { hash } = params
    console.log(hash);
    const formData = await req.formData();
  
    const name = formData.get("name");
    const email = formData.get("email");
    const date = formData.get("date");
    const time = formData.get("time");
    const musicLink = formData.get("musicLink");
    const message = formData.get("message");
    const photoFiles = formData.getAll('photos');

    console.log('photoFiles test', photoFiles);
    console.log(name, email)

    const currentUser = await User.findOne({hash: hash});

    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  
    
    // this will return an array saved it in the db
    // If new photos are uploaded, handle the photo update
    let uploadedPhotoURLs = [];
    if (photoFiles.length > 0) {
      uploadedPhotoURLs = await uploadImages(photoFiles, hash, name);
    }

    const updatedObj = {
      name: name,
      email: email,
      date: date,
      time: time,
      musicLink: musicLink,
      message: message, 
      email: email ? email : null,
      photos: uploadedPhotoURLs
    }

    const updatedUser = await User.findOneAndUpdate(
      {hash: hash}, // Find user by hash
      // {photos: uploadedPhotoURLs}, // will update only the photos
      updatedObj, // updates entire object overwriting everything but for the hash
      {new: true} // Return the updated user document
  )

  
    return NextResponse.json({
      message: 'success',
      user: updatedUser
    })
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}