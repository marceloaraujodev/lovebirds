import { NextResponse } from "next/server";
import User from "@/app/model/user";
import { mongooseConnect } from "@/app/lib/mongooseConnect";

export async function PATCH(req){
  await mongooseConnect();
  try {
    // const { hash } = await req.json();
    const formData = await req.formData();
    // console.log(hash);


    // Extract data from formData
    const name = formData.get('name');
    const email = formData.get("email");
    const date = formData.get('date');
    const time = formData.get('time');
    const musicLink = formData.get('musicLink');
    const url = formData.get('url');
    // const hash = formData.get('hash');
    const message = formData.get('message');

    const photos = [];
    const photoFiles = formData.getAll('photos');

    console.log('this is formdata', name, email)

    // const updatedUser = await User.findOneAndUpdate({hash})
    // const updatedUser = await User.findOne({hash: hash})
    
    return NextResponse.json({
      message: 'User profile updated successfully',
      // updatedUser
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      message: 'Failed to update user profile'
    })
  }

}