export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/special-offers',
        languages: {
          'en': 'https://www.mysinotruk.ae/special-offers',
          'ar': 'https://www.mysinotruk.ae/ar/special-offers',
        },
    },
  title: 'Sinotruk Special Offers: Save Big! New Bolden Deals & Promotions.',
  description: 'Don’t miss out! Explore the latest Sinotruk Bolden special offers, deals, & promotions on  Off-Road, Passenger & Commercial trucks in UAE. Limited time deals!',
  openGraph: {
      title: 'Sinotruk Special Offers: Save Big! New Bolden Deals & Promotions.',
      description: 'Don’t miss out! Explore the latest Sinotruk Bolden special offers, deals, & promotions on  Off-Road, Passenger & Commercial trucks in UAE. Limited time deals!',
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