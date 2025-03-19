import { NextResponse } from "next/server";
import User from "@/app/model/user";
import { mongooseConnect } from "@/app/lib/mongooseConnect";
import { deleteFileByUrl } from "@/app/utils/deleteUserFilesFromFireBase";


export async function DELETE(req) {
  await mongooseConnect();
  try {

  const users = await User.find({paid: false})
  console.log('user', users)
  
  await Promise.all(users.map(async (user) => {
    // Wait for all photos to be deleted
    // checks if user.photos has any photos and if user has not pay 
    if(user.photos.length > 0 && user.paid === false){
      await Promise.all(
        user.photos.map(photo => deleteFileByUrl(photo))
      );

      // empty photos array
      user.photos = [];
      await user.save();
    }
  }))

  return NextResponse.json({
    message: "Success",
    // unpaid,
  });
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}
