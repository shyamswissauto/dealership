// app/layout.jsx
import "./globals.css";
import CookieConsent from "@/components/cookies/CookieConsent";

import Script from "next/script";

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
  title: "AutoBrand",
  description: "Models Carousel with Offcanvas Navbar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${redRose.variable}  ${almarai.variable} ${poppins.variable}`}>
      <body>
        {children}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
        <CookieConsent />
      </body>
    </html>
  );
}
