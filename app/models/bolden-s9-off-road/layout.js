export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/models/bolden-s9-off-road',
        languages: {
          'en': 'https://www.mysinotruk.ae/models/bolden-s9-off-road',
          'ar': 'https://www.mysinotruk.ae/ar/models/bolden-s9-off-road',
        },
    },
  title: 'Bolden Off-Road 4x4 Pickup Truck for sale. Best off-road vehicle in UAE',
  description: 'Built for the UAE Desert. Bolden Off-Road 4x4 features a powerful diesel engine with exceptional warranty and tough chassis. View full specs & Get the Price!',
  openGraph: {
      title: 'Bolden Off-Road 4x4 Pickup Truck for sale. Best off-road vehicle in UAE',
      description: 'Built for the UAE Desert. Bolden Off-Road 4x4 features a powerful diesel engine with exceptional warranty and tough chassis. View full specs & Get the Price!',
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