import { NextResponse } from 'next/server';

export async function GET(request) {
  console.log(process.env.CRON_SECRET);
  // Verify cron secret
  const authHeader = request.headers.get('Authorization');
  console.log('this is authHeader:', authHeader);
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  console.log('Cron job executed successfully');
  
  // Add your cron logic here
  // Example: database cleanup, data sync, etc.
  
  return NextResponse.json({ success: true });
}