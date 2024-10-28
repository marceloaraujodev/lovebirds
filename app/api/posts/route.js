import { NextResponse } from "next/server";
import Post from '../../model/post';
import { mongooseConnect } from "@/app/lib/mongooseConnect";
import dotenv from 'dotenv';
dotenv.config();

export async function GET(req ){
  await mongooseConnect();
  try {
    const posts = await Post.find({});
    // console.log(posts);
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.log(error);
    return NextResponse.status(500).json({ message: 'An error occurred' });
  }
  
}