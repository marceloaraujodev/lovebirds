import { NextResponse } from "next/server";
import User from "@/app/model/user";
import { mongooseConnect } from "@/app/lib/mongooseConnect";

export async function GET(req, { params }){
  mongooseConnect();

  const { hash } = params;
  // console.log(hash)

  const user = await User.findOne({hash: hash})
  // console.log(user);

  return NextResponse.json({
    message: 'success',
    user: user,
  })
}