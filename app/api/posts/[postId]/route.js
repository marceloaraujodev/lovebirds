import { NextResponse } from "next/server";
import Post from '../../../model/post';
import { mongooseConnect } from "@/app/lib/mongooseConnect";

export async function GET(req, {params}){
  await mongooseConnect();
  // const {searchParams} = new URLSearchParams(req.url);
  // const postId = searchParams.get('postId')
  const {postId} = params
  console.log('this is postId:', postId)
  console.log('this is params:', params)
  console.log('print me')
  const postIdAsNumber = Number(postId)
  try {
    const post = await Post.find({id: postIdAsNumber})
    if (!post) {
      return NextResponse.json({ message: 'Post not found' });
    }

    console.log(post)
    return NextResponse.json({post})
  } catch (error) {
    
    return NextResponse.json({ message: 'An error occurred' });
  }
}