export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/terms-of-use',
        languages: {
          'en': 'https://www.mysinotruk.ae/terms-of-use',
        },
    },
  title: 'Bolden UAE – 10-Year Warranty, 0% Down Payment & Exclusive Offers.',
  description: 'Drive home a Bolden in the UAE with a 10-year warranty, zero down payment, free registration, and a 5-year service plan.',
  openGraph: {
      title: 'Bolden UAE – 10-Year Warranty, 0% Down Payment & Exclusive Offers.',
      description: 'Drive home a Bolden in the UAE with a 10-year warranty, zero down payment, free registration, and a 5-year service plan.',
      url: 'https://www.mysinotruk.ae/terms-of-use',
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
          alt: 'Bolden UAE',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
}



export default function BoldenUAELayout({ children }) {
  return (
    <div>
      {/* Layout styling or components like a header, sidebar, etc., can go here */}
      {children}
    </div>
  );
}