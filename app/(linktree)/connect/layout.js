export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/connect',
        languages: {
          'en': 'https://www.mysinotruk.ae/connect',
        },
    },
  title: 'Connect with Sinotruk UAE',
  description: 'Have questions or need details? Connect with Sinotruk UAE to get expert support and personalized assistance',
  openGraph: {
      title: 'Connect with Sinotruk UAE',
      description: 'Have questions or need details? Connect with Sinotruk UAE to get expert support and personalized assistance',
      url: 'https://www.mysinotruk.ae/connect',
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