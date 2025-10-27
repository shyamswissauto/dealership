// app/layout.jsx
import "./globals.css";
import { Suspense } from "react";
import Script from "next/script";

import CookieConsent from "@/components/cookies/CookieConsent";
import GoogleTagManager from "@/components/analytics/GoogleTagManager";
import GtmPageView from "@/components/analytics/GtmPageView";


import { Red_Rose, Almarai, Poppins } from "next/font/google";

const redRose = Red_Rose({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], 
  display: "swap",
  variable: "--font-red-rose",   
  adjustFontFallback: true,
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300","400","500","600","700"],
    style: ["normal", "italic"],
    display: "swap",
    variable: "--font-poppins",
    adjustFontFallback: true,
});

const almarai = Almarai({
    weight: ['400', '700', '800'],
    subsets: ['arabic'],
    variable: "--font-almarai",
    display: 'swap',
    fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
});

export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/',
        languages: {
          'en': 'https://www.mysinotruk.ae',
        },
    },
  title: 'Explore Sinotruk Bolden Pickups in UAE – Power Meets Style',
  description: 'Discover the bold design, rugged performance, and unbeatable value of Sinotruk Bolden pickups in UAE. Perfect for work and adventure!',
  openGraph: {
      title: 'Explore Sinotruk Bolden Pickups in UAE – Power Meets Style',
      description: 'Discover the bold design, rugged performance, and unbeatable value of Sinotruk Bolden pickups in UAE. Perfect for work and adventure!',
      url: 'https://www.mysinotruk.ae',
      siteName: 'www.mysinotruk.ae',
      images: [
        {
          url: 'assets/images/og/sinotruk.png',
          width: 800,
          height: 600,
        },
        {
          url: 'assets/images/og/sinotruk.png',
          width: 1800,
          height: 1600,
          alt: 'Sinotruk Bolden UAE',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
}

const GTM_ID = "GTM-W769MT2C";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${redRose.variable}  ${almarai.variable} ${poppins.variable}`}>
      <body>
        <GoogleTagManager gtmId={GTM_ID} />
        {children}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
        <CookieConsent />
        <Suspense fallback={null}>
          <GtmPageView />
        </Suspense>
      </body>
    </html>
  );
}
