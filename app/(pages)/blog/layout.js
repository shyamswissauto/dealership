export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/blog',
        languages: {
          'en': 'https://www.mysinotruk.ae/blog',
          'ar': 'https://www.mysinotruk.ae/ar/blog',
        },
    },
  title: 'Insights & Updates on Sinotruk Bolden | MySinotruk UAE Blog',
  description: 'Explore expert articles on bolden, heavy-duty vehicles, maintenance tips, fleet solutions, and Sinotruk updates. Stay informed with the MySinotruk UAE Blog.',
  openGraph: {
      title: 'Insights & Updates on Sinotruk Bolden | MySinotruk UAE Blog',
      description: 'Explore expert articles on bolden, heavy-duty vehicles, maintenance tips, fleet solutions, and Sinotruk updates. Stay informed with the MySinotruk UAE Blog.',
      url: 'https://www.mysinotruk.ae/blog',
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