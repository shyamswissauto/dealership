export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/models',
        languages: {
          'en': 'https://www.mysinotruk.ae/models',
        },
    },
  title: 'Sinotruk Models in UAE - For Commercial, Off-Road, Passenger',
  description: 'Explore Sinotruk Models in UAE,  For Commercial, Off-road, Passenger. Find the perfect model that fits your business or adventure needs today',
  openGraph: {
      title: 'Sinotruk Models in UAE - For Commercial, Off-Road, Passenger',
      description: 'Explore Sinotruk Models in UAE,  For Commercial, Off-road, Passenger. Find the perfect model that fits your business or adventure needs today',
      url: 'https://www.mysinotruk.ae/models',
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