export const metadata = {
  metadataBase: new URL('https://mysinotruk.ae'),
    alternates: {
        canonical: '/bolden-uae/',
        languages: {
          'en': 'https://mysinotruk.ae/bolden-uae/',
        },
    },
  title: 'Bolden UAE | Royal Swiss Auto Trading',
  description: 'Bolden UAE | Royal Swiss Auto Trading',
  openGraph: {
      title: 'Bolden UAE | Royal Swiss Auto Trading',
      description: 'Bolden UAE | Royal Swiss Auto Trading',
      url: 'https://mysinotruk.ae/bolden-uae/',
      siteName: 'www.mysinotruk.ae',
      images: [
        {
          url: 'assets/images/og/sinotruk-vgv-u70-pro.png',
          width: 800,
          height: 600,
        },
        {
          url: 'assets/images/og/sinotruk-vgv-u70-pro.png',
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