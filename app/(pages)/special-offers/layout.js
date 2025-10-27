export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/special-offers',
        languages: {
          'en': 'https://www.mysinotruk.ae/special-offers',
        },
    },
  title: 'Special Offers on Sinotruk Bolden Off-Road, Passenger and Commercial Models',
  description: 'Don’t miss exciting special offers on Sinotruk The Bolden Off-Road, Passenger and Commercial. Save big on commercial, passenger, and off-road models. Limited-time deals!',
  openGraph: {
      title: 'Special Offers on Sinotruk Bolden Off-Road, Passenger and Commercial Models',
      description: 'Don’t miss exciting special offers on Sinotruk The Bolden Off-Road, Passenger and Commercial. Save big on commercial, passenger, and off-road models. Limited-time deals!',
      url: 'https://www.mysinotruk.ae/special-offers',
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