import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';
dotenv.config();

export async function POST(req) {
  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
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
              title: 'My product',
              quantity: 1,
              unit_price: 2000,
            },
          ],
        },
      })
      // .then(console.log)
      // .catch(console.log);

      console.log(res);


    return NextResponse.json({ message: 'success', preferenceId: res.id });
  } catch (error) {
    console.error('Error creating preference:', error);
    return NextResponse.json(
      { error: 'Failed to create preference' },
      { status: 500 }
    );
  }
}
