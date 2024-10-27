import { NextResponse } from "next/server";
import Post from '../../../model/post';
import { mongooseConnect } from "@/app/lib/mongooseConnect";

export async function GET(req, {params}){
  await mongooseConnect();

  const {postId} = params;

  try {
    const post = await Post.findOne({ postId })

    if (!post) {
      return NextResponse.json({ message: 'Post not found' });
    }

    return NextResponse.json({post})
  } catch (error) {
    
    return NextResponse.json({ message: 'An error occurred' });
  }
}