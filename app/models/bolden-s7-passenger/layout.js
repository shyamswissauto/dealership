export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/models/bolden-s7-passenger',
        languages: {
          'en': 'https://www.mysinotruk.ae/models/bolden-s7-passenger',
        },
    },
  title: 'Buy Bolden Passenger Pickup: Specs, Features & Price in UAE',
  description: 'Bolden Passenger Pickup blends comfort and power for your daily drive. View detailed features, interior design, and get the latest price in the UAE.',
  openGraph: {
      title: 'Buy Bolden Passenger Pickup: Specs, Features & Price in UAE',
      description: 'Bolden Passenger Pickup blends comfort and power for your daily drive. View detailed features, interior design, and get the latest price in the UAE.',
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