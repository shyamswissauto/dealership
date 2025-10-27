export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/models/bolden-s6-commercial',
        languages: {
          'en': 'https://www.mysinotruk.ae/models/bolden-s6-commercial',
        },
    },
  title: 'Sinotruk The Bolden Commercial – Built for Tough Jobs',
  description: 'Experience Sinotruk The Bolden Commercial, engineered for durability and performance. Perfect for heavy-duty work with comfort and efficiency',
  openGraph: {
      title: 'Sinotruk The Bolden Commercial – Built for Tough Jobs',
      description: 'Experience Sinotruk The Bolden Commercial, engineered for durability and performance. Perfect for heavy-duty work with comfort and efficiency',
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