export const metadata = {
  metadataBase: new URL('https://mysinotruk.ae'),
    alternates: {
        canonical: '/bolden-s9-off-road/',
        languages: {
          'en': 'https://mysinotruk.ae/models/bolden-s9-off-road/',
          'ar': 'https://mysinotruk.ae/ar/models/bolden-s9-off-road/',
        },
    },
  title: 'Bolden S9 Off-Road',
  description: 'Bolden S9 Off-Road',
  openGraph: {
      title: 'Bolden S9 Off-Road',
      description: 'Bolden S9 Off-Road',
      url: 'https://mysinotruk.ae/models/bolden-s9-off-road/',
      siteName: 'www.mysinotruk.ae',
      images: [
        {
          url: 'assets/images/og/bolden-s9-off-road.png',
          width: 800,
          height: 600,
        },
        {
          url: 'assets/images/og/bolden-s9-off-road.png',
          width: 1800,
          height: 1600,
          alt: 'Bolden S9 Off-Road',
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