export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/models/bolden-s9-off-road',
        languages: {
          'en': 'https://www.mysinotruk.ae/models/bolden-s9-off-road',
        },
    },
  title: 'Sinotruk The Bolden Off-Road – Off-Road Powerhouse',
  description: 'Experience Sinotruk The Bolden Off-Road  built for adventure. Experience rugged strength, sleek design, and unmatched performance on every terrain in the UAE',
  openGraph: {
      title: 'Sinotruk The Bolden Off-Road – Off-Road Powerhouse',
      description: 'Experience Sinotruk The Bolden Off-Road  built for adventure. Experience rugged strength, sleek design, and unmatched performance on every terrain in the UAE',
      url: 'https://www.mysinotruk.ae/models/bolden-s9-off-road',
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



export default function BoldenS9Layout({ children }) {
  return (
    <div>
      {/* Layout styling or components like a header, sidebar, etc., can go here */}
      {children}
    </div>
  );
}