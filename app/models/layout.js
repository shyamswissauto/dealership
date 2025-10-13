export const metadata = {
  metadataBase: new URL('https://mysinotruk.ae'),
    alternates: {
        canonical: '/models/',
        languages: {
          'en': 'https://mysinotruk.ae/models/',
          'ar': 'https://mysinotruk.ae/ar/models/',
        },
    },
  title: 'BOLDEN Models',
  description: 'BOLDEN Models',
  openGraph: {
      title: 'BOLDEN Models',
      description: 'BOLDEN Models',
      url: 'https://mysinotruk.ae/models/',
      siteName: 'www.mysinotruk.ae',
      images: [
        {
          url: 'assets/images/og/models.png',
          width: 800,
          height: 600,
        },
        {
          url: 'assets/images/og/models.png',
          width: 1800,
          height: 1600,
          alt: 'BOLDEN Models',
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