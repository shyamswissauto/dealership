export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/models/bolden-s6-commercial',
        languages: {
          'en': 'https://www.mysinotruk.ae/models/bolden-s6-commercial',
        },
    },
  title: 'Drive Bolden Commercial Pickup Trucks: Best for Utility & Fleet Deals',
  description: 'Bolden Commercial is the top-rated commercial work trucks for reliability, durability and lowest TCO in the UAE. Boost your fleet now! Request a Business Quote!',
  openGraph: {
      title: 'Drive Bolden Commercial Pickup Trucks: Best for Utility & Fleet Deals',
      description: 'Bolden Commercial is the top-rated commercial work trucks for reliability, durability and lowest TCO in the UAE. Boost your fleet now! Request a Business Quote!',
      url: 'https://www.mysinotruk.ae/models/bolden-s6-commercial',
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
          alt: 'Bolden Commercial UAE',
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