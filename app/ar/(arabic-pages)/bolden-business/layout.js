export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/bolden-business',
        languages: {
          'en': 'https://www.mysinotruk.ae/bolden-business',
        },
    },
  title: 'Bolden Business - Sinotruk Bolden Off-Road, Passenger & Commercial',
  description: 'Experience Bolden Business by MySinotruk — top off-road, passenger, and commercial trucks built for power, performance, and reliability on any terrain in UAE',
  openGraph: {
      title: 'Bolden Business - Sinotruk Bolden Off-Road, Passenger & Commercial',
      description: 'Experience Bolden Business by MySinotruk — top off-road, passenger, and commercial trucks built for power, performance, and reliability on any terrain in UAE',
      url: 'https://www.mysinotruk.ae/bolden-business',
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