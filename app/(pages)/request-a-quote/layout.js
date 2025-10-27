export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/request-a-quote',
        languages: {
          'en': 'https://www.mysinotruk.ae/request-a-quote',
        },
    },
  title: 'Request a Quote for Sinotruk Bolden Off-Road, Passenger and Commercial',
  description: 'Get your personalized quote for Sinotruk The Bolden Off-Road, Passenger and Commercial today. Explore pricing and features for commercial, passenger & off-road models in UAE',
  openGraph: {
      title: 'Request a Quote for Sinotruk Bolden Off-Road, Passenger and Commercial',
      description: 'Get your personalized quote for Sinotruk The Bolden Off-Road, Passenger and Commercial today. Explore pricing and features for commercial, passenger & off-road models in UAE',
      url: 'https://www.mysinotruk.ae/request-a-quote',
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