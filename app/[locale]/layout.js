import localFont from "next/font/local";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Poppins } from "next/font/google";
import { Inter } from "next/font/google";

import "../globals.css";

const poppins = Poppins({
  subsets: ["latin"], // Subsets for language support
  weight: ["400", "600", "700"], // Add desired weights (e.g., regular, semi-bold, bold)
  variable: "--font-poppins", // Define a CSS variable for the font
});

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });

export const metadata = {
  title: "QRCode Love",
  description: "The surprise everyone deserves",
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  // console.log("Detected locale:", locale); // this seems to be running before middleware is this correct?
  const messages = await getMessages({ locale });

  return (
    <html lang="en">
      <head>
        {/* google add sense */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-16751184617"></Script>
        <Script id="google-adds" strategy="afterInteractive">
          {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments)}
                    gtag('js', new Date());
                  
                    gtag('config', 'AW-16751184617');
                    `}
        </Script>

        {/* <!-- Event snippet for Purchase conversion page --> */}
        <Script id="google-conversion-tracking" strategy="afterInteractive">
          {`
                    gtag('event', 'conversion', {
                        'send_to': 'AW-16751184617/qI-0COTM4uAZEOmVy7M-',
                        'value': 1.0,
                        'currency': 'BRL',
                        'transaction_id': ''
                    });
                    `}
        </Script>

        {/* end google add sense */}

        {/* Mercado pago Script */}
        <Script src="https://sdk.mercadopago.com/js/v2" strategy="beforeInteractive" id="mercadoPago"></Script>
      </head>
      <body className={`${inter.variable} ${inter.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
