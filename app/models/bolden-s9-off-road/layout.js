export const metadata = {
  metadataBase: new URL('https://mysinotruk.ae'),
    alternates: {
        canonical: '/models/bolden-s9-off-road/',
        languages: {
          'en': 'https://mysinotruk.ae/models/bolden-s9-off-road/',
        },
    },
  title: 'Bolden S9 Off-Road | Royal Swiss Auto Trading',
  description: 'Bolden S9 Off-Road | Royal Swiss Auto Trading',
  openGraph: {
      title: 'Bolden S9 Off-Road | Royal Swiss Auto Trading',
      description: 'Bolden S9 Off-Road | Royal Swiss Auto Trading',
      url: 'https://mysinotruk.ae/models/bolden-s9-off-road/',
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