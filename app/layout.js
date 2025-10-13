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
  title: "Sinotruk - Swiss Auto Trading",
  description: "Sinotruk - Swiss Auto Trading",
};

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
