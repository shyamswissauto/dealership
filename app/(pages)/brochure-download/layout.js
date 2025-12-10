export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/brochure-download',
        languages: {
          'en': 'https://www.mysinotruk.ae/brochure-download',
        },
    },
  title: 'Download Sinotruk Bolden Brochure | Explore Features & Specs',
  description: 'Get the full details! Download the official Sinotruk Bolden brochures. Includes complete technical specs, engine details, and safety features for all models.',
  openGraph: {
      title: 'Download Sinotruk Bolden Brochure | Explore Features & Specs',
      description: 'Get the full details! Download the official Sinotruk Bolden brochures. Includes complete technical specs, engine details, and safety features for all models.',
      url: 'https://www.mysinotruk.ae/brochure-download',
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