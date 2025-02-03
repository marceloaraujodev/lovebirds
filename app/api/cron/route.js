import { NextResponse } from 'next/server';

export async function GET() {
  // // to secure cron job
  // if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return res.status(401).end('Unauthorized');
  // }

  console.log('this is the cron job')

  return NextResponse.json({ ok: true });
}