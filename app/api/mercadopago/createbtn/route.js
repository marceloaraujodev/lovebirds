import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { mongooseConnect } from '@/app/lib/mongooseConnect';
import { siteUrl } from '@/config';
import dotenv from 'dotenv';
dotenv.config();

// Notifications change url after testing is done at localhost and moved to qrcodelove

export async function POST(req) {
  await mongooseConnect();
  console.log('created btn running ---------------------');

  try {

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN,
    });

    const preference = new Preference(client);

    const res = await preference
      .create({
        body: {
          payment_methods: {
            excluded_payment_methods: [
              {
                id: 'pec',
              },
            ],
            excluded_payment_types: [],
            installments: 1,
          },
          items: [
            {
              title: 'QR Code Love',
              quantity: 1,
              unit_price: 19.99,
            },
          ],
          back_urls: {
            success: `${siteUrl}/success`, // Adjust URLs as needed
            failure: `${siteUrl}/failure`,
          },
          notification_url: `https://0722-2804-1b2-6043-6d70-3db9-284d-f200-6896.ngrok-free.app/api/mercadopago/webhook`, 
        },
    });

    return NextResponse.json({ message: 'success', preferenceId: res.id });
  } catch (error) {
    console.error('Error creating preference:', error);
    return NextResponse.json(
      { error: 'Failed to create preference' },
      { status: 500 }
    );
  }
}
