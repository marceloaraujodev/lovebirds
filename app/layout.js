import localFont from "next/font/local";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Script from "next/script";
import { Poppins } from "next/font/google";
import { Inter } from "next/font/google";

import "./globals.css";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-1707785168539513" />
        {/* ad sense displaying adds */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1707785168539513"
          crossorigin="anonymous"></Script>

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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
