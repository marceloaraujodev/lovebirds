import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config();

export async function GET(request) {
  const authHeader = request.headers.get('Authorization')?.trim();
  const cronSecret = process.env.CRON_SECRET?.trim();
  console.log(`Auth Header: "${authHeader}"`);
  console.log(`Env Secret: "Bearer ${process.env.CRON_SECRET}"`);
  console.log('cronSecret: ', cronSecret);
  // Verify cron secret
  // const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  console.log('Cron job executed successfully');
  
  
  // Add your cron logic here
  // Example: database cleanup, data sync, etc.
  
  return NextResponse.json({ success: true });
}