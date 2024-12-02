import { NextResponse } from "next/server";

export async function POST(req){
  const data = await req.json();

  console.log('data from proccess payment route:', data);

  return NextResponse.json({message: 'success'}, {status: 200});
}