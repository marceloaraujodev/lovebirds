import localFont from "next/font/local";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Script from "next/script";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "QRCode Love",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

        {/* <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XJDFYZMLWL"
        ></Script>

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XJDFYZMLWL');
          `}
        </Script> */}

        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-10848814917"></Script>
        <Script id="google-adds" strategy="afterInteractive">
          {
            `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments)}
            gtag('js', new Date());

            gtag('config', 'AW-10848814917');
            `
          }
        </Script>

        <Script
          id="google-conversion-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function gtag_report_conversion(url) {
                var callback = function () {
                  if (typeof(url) != 'undefined') {
                    window.location = url;
                  }
                };
                gtag('event', 'conversion', {
                    'send_to': 'AW-10848814917/q2YtCP-0wd4ZEMWOj7Uo',
                    'value': 1.0,
                    'currency': 'BRL',
                    'transaction_id': '',
                    'event_callback': callback
                });
                return false;
              }
          `,
        }}
      />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
