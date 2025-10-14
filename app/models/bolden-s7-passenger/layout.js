export const metadata = {
  metadataBase: new URL('https://mysinotruk.ae'),
    alternates: {
        canonical: '/models/bolden-s7-passenger/',
        languages: {
          'en': 'https://mysinotruk.ae/models/bolden-s7-passenger/',
        },
    },
  title: 'Bolden S7 Passenger | Royal Swiss Auto Trading',
  description: 'Bolden S7 Passenger | Royal Swiss Auto Trading',
  openGraph: {
      title: 'Bolden S7 Passenger | Royal Swiss Auto Trading',
      description: 'Bolden S7 Passenger | Royal Swiss Auto Trading',
      url: 'https://mysinotruk.ae/models/bolden-s7-passenger/',
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
          alt: 'Bolden S7 Passenger',
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