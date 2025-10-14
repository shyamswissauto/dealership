export const metadata = {
  metadataBase: new URL('https://mysinotruk.ae'),
    alternates: {
        canonical: '/sinotruk/',
        languages: {
          'en': 'https://mysinotruk.ae/models/sinotruk/',
          'ar': 'https://mysinotruk.ae/ar/models/sinotruk/',
        },
    },
  title: 'Sinotruk',
  description: 'Sinotruk',
  openGraph: {
      title: 'Sinotruk',
      description: 'Sinotruk',
      url: 'https://mysinotruk.ae/models/sinotruk/',
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
          alt: 'Sinotruk',
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