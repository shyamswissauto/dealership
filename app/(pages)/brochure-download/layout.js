export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/brochure-download',
        languages: {
          'en': 'https://www.mysinotruk.ae/brochure-download',
        },
    },
  title: 'Download Sinotruk Bolden Off-Road, Passenger, Commercial Brochure Today',
  description: 'Get your Sinotruk The Bolden Off-Road, Passenger, Commercial brochures now! Explore features, specs, and designs with a simple brochure download',
  openGraph: {
      title: 'Download Sinotruk Bolden Off-Road, Passenger, Commercial Brochure Today',
      description: 'Get your Sinotruk The Bolden Off-Road, Passenger, Commercial brochures now! Explore features, specs, and designs with a simple brochure download',
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