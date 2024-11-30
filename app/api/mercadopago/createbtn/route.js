import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { mongooseConnect } from '@/app/lib/mongooseConnect';
import { siteUrl } from '@/config';
import dotenv from 'dotenv';
dotenv.config();

export async function POST(req) {
  await mongooseConnect();
  console.log('created btn running');

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
          ],back_urls: {
            success: `${process.env.siteUrl}/success`, // Adjust URLs as needed
            failure: `${process.env.siteUrl}/failure`,
          },
          metadata: {
            name: "User Name",
            date: "2024-10-01",
            time: "12:36",
            hash: "unique-hash-id",
            email: "user@example.com",
            url: "user/unique-url",
          },
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
