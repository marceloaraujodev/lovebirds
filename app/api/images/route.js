import { NextResponse } from "next/server";
import User from "@/app/model/user";
import { mongooseConnect } from "@/app/lib/mongooseConnect";
import { deleteFileByUrl } from "@/app/utils/deleteUserFilesFromFireBase";

export async function DELETE(req) {
  await mongooseConnect();
  try {

    
    // const unpaid = await User.find({ paid: false });
  //  const i = deleteFolderContents('Marcelo e Dayse', '900e1c14-88d9-46a6-afbd-7152b3b64006')
  //  const imgArr = 
  // const users = await User.find({hash: '98eaa263-2c44-4430-9bb2-337dd397fef6'})
  const users = await User.find({paid: false})
  console.log('user', users)
  
  await Promise.all(users.map(async (user) => {
    // Wait for all photos to be deleted
    // checks if user.photos has any photos
    if(user.photos.length > 0){
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
