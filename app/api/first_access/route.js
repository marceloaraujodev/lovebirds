import { NextResponse } from "next/server";
import User from "@/app/model/user";
import { mongooseConnect } from "@/app/lib/mongooseConnect";

export async function POST(req){
  await mongooseConnect();
  try {
    const {firstAccess, hash} = await req.json();
  
    console.log(firstAccess, hash);
  
    const user = await User.findOne({hash: hash});

    if(!user) return NextResponse.json({message: 'User not found'}, {status: 404})

    if (user.firstAccess !== firstAccess) {
      user.firstAccess = firstAccess;
      await user.save();      
      return NextResponse.json({message: 'first access updated'}, {status: 200})
    }
     // Explicit response for no update needed
     return NextResponse.json({ message: 'No update needed' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({message:'Server Error', error: error}, {status: 500})
  }
}