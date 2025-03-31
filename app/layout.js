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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-1707785168539513" />
        {/* ad sense script - no ad sense added yet */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1707785168539513"
          crossorigin="anonymous">
        
        </Script>

        {/* Google Tag Manager Script */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-16751184617"></Script>
        <Script id="google-adds" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          if (!window.gtagInitialized) {
            gtag('js', new Date());
            gtag('config', 'AW-16751184617', { send_page_view: false }); // Disable automatic page view tracking
            window.gtagInitialized = true; // Prevent re-initialization
          }
        `}
      </Script>

        {/* end google add sense */}

        {/* Mercado pago Script */}
        <Script src="https://sdk.mercadopago.com/js/v2" strategy="beforeInteractive" id="mercadoPago"></Script>
      </head>
      <body className={`${inter.variable}`} suppressHydrationWarning>
        <Header />
        {children}
        <Footer />
        <noscript>
          <div>
            This site requires JavaScript to function properly. Please enable JavaScript in your browser settings.
          </div>
        </noscript>
      </body>
    </html>
  );
}
