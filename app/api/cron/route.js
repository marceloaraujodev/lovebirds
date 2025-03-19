import { NextResponse } from 'next/server';
import User from '@/app/model/user';
import { subYears } from "date-fns";
import dotenv from 'dotenv';
import { mongooseConnect } from "@/app/lib/mongooseConnect";
import { deleteFileByUrl } from "@/app/utils/deleteUserFilesFromFireBase";

dotenv.config();

// to activate turn the job on cron-job.org account
export async function GET(request) {
  const authHeader = request.headers.get('Authorization')?.trim();
  console.log('cron job running')
  console.log(`Auth Header: "${authHeader}"`);
  console.log(`Env Secret: "${process.env.CRON_SECRET}"`);

  // Verify cron secret
  // const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {

    // finds unpaid users
    const users = await User.find({paid: false})
    console.log('user', users)
    
    // maps all users array then goes into user document and deletes the photos if user has not paid
    await Promise.all(users.map(async (user) => {
      // Wait for all photos to be deleted
      // checks if user.photos has any photos
      if(user.photos.length > 0 && user.paid === false){
        await Promise.all(
          // deletes the photos from those unpaid accounts
          user.photos.map(photo => deleteFileByUrl(photo))
        );
  
        // empty photos array
        user.photos = [];
        await user.save();
      }
    }))

    // Get the date 1 year ago
    const oneYearAgo = subYears(new Date(), 1);

    // Query to find users where createdAt is older than 1 year
    const oldEntries = await User.find({
      createdAt: { $lt: oneYearAgo }, // Find entries with createdAt less than 1 year ago
    });

    if (oldEntries.length > 0) {
      // Delete the old entries by filtering on the createdAt field
      await Promise.all(oldEntries.map(async (user) => {
        // Wait for all photos to be deleted
        // checks if user.photos has any photos and if user has not pay 
        if(user.photos.length > 0){
          await Promise.all(
            user.photos.map(photo => deleteFileByUrl(photo))
          );
    
          // empty photos array
          user.photos = [];
          await user.save();
        }
      }))
    } 

    console.log('Cron job executed successfully');
    return NextResponse.json({ success: true, deleted: oldEntries.length });
  } catch (error) {
    console.error("Error fetching old entries:", error);
    throw new Error("Something went wrong");
  }

}