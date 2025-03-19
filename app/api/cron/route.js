import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

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

  console.log('Cron job executed successfully');
  
  
  // Add your cron logic here
  // Example: database cleanup, data sync, etc.
  
  return NextResponse.json({ success: true });
}