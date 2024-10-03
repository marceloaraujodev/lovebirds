import { NextResponse } from "next/server";
import User from "@/app/model/user";
import { mongooseConnect } from "@/app/lib/mongooseConnect";

export async function GET(req, { params}){
  mongooseConnect();

  const {couplesName, id} = params;

  
  // console.log('this is id from couples route:', id, couplesName)

  const user = await User.findOne({ hash: id });

  // console.log(user)
  
  // if (!user) {
  //   return NextResponse.status(404).json({ message: 'User not found' });
  // }

    return NextResponse.json({
      success: true,
      user
    });
    


}