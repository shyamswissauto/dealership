export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/models/bolden-s7-passenger',
        languages: {
          'en': 'https://www.mysinotruk.ae/models/bolden-s7-passenger',
        },
    },
  title: 'Sinotruk The Bolden Passenger – Comfort Meets Power',
  description: 'Experience the Sinotruk Bolden Passenger, a perfect mix of power, comfort, and modern design for family and business travel in the UAE',
  openGraph: {
      title: 'Sinotruk The Bolden Passenger – Comfort Meets Power',
      description: 'Experience the Sinotruk Bolden Passenger, a perfect mix of power, comfort, and modern design for family and business travel in the UAE',
      url: 'https://www.mysinotruk.ae/models/bolden-s7-passenger',
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
          alt: 'Bolden Passenger UAE',
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