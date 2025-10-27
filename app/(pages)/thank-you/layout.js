export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/thank-you',
        languages: {
          'en': 'https://www.mysinotruk.ae/thank-you',
        },
    },
  title: 'Thank You for Choosing Sinotruk',
  description: 'Thank you for your interest in Sinotruk The Bolden Off-Road, Passenger and Commercial. We appreciate your trust and will connect soon with more details and updates.',
  openGraph: {
      title: 'Thank You for Choosing Sinotruk',
      description: 'Thank you for your interest in Sinotruk The Bolden Off-Road, Passenger and Commercial. We appreciate your trust and will connect soon with more details and updates.',
      url: 'https://www.mysinotruk.ae/thank-you',
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