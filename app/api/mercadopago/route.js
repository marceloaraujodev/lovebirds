import { NextResponse } from "next/server";
import processFormDataAndCreateUser from "@/app/utils/paymentUtils";
import Click from "@/app/model/click";

export async function POST(req){
  try {
    const formData = await req.formData();
    
    // processes all form data and creates a new user
    await processFormDataAndCreateUser(formData)
  
    // Find the Click document and increment clicks by 1 or create it if not exists
    await Click.findOneAndUpdate(
      {},  // Your criteria; leave empty if there's only one click counter document
      { $inc: { clicks: 1 } },
      { new: true, upsert: true } // `upsert` option will create the document if it doesn't exist
    );
  
    return NextResponse.json({message: 'success', status: 200})
    
  } catch (error) {
    return NextResponse.json({message: error.message, status: 500})
  }
}