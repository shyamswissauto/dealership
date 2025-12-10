export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/bolden-business',
        languages: {
          'en': 'https://www.mysinotruk.ae/bolden-business',
        },
    },
  title: 'Bolden Business: Fleet Solution & Corporate Deals on all Bolden Models',
  description: 'Optimize your operations with Bolden Business fleet solutions. Get exclusive corporate pricing, dedicated support, & Best packages for your commercial vehicle needs.',
  openGraph: {
      title: 'Bolden Business: Fleet Solution & Corporate Deals on all Bolden Models',
      description: 'Optimize your operations with Bolden Business fleet solutions. Get exclusive corporate pricing, dedicated support, & Best packages for your commercial vehicle needs.',
      url: 'https://www.mysinotruk.ae/bolden-business',
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