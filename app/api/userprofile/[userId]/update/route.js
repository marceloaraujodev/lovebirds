import { NextResponse } from "next/server";
import User from "@/app/model/user";
import { mongooseConnect } from "@/app/lib/mongooseConnect";

export async function PATCH(req, { params }){
  try {
    mongooseConnect();
    // using the hash as the userId
    const { userId } = params
    console.log(params);
    const formData = await req.formData();
  
    const name = formData.get("name");
    const email = formData.get("email");
    const date = formData.get("date");
    const time = formData.get("time");
    const musicLink = formData.get("musicLink");
    const message = formData.get("message");
  
    const updatedObj = {
      name: name,
      email: email,
      date: date,
      time: time,
      musicLink: musicLink,
      message: message, 
      email: email ? email : null,
    }
    
    const updatedUser = await User.findOneAndUpdate(
      {hash: userId}, 
      updatedObj,
      {new: true}
  )
  
    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  
    return NextResponse.json({
      message: 'success',
      user: updatedUser
    })
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}