export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/contact-us',
        languages: {
          'en': 'https://www.mysinotruk.ae/contact-us',
        },
    },
  title: 'Contact Us - Sinotruk Bolden Off-Road, Passenger & Commercial',
  description: 'Get in touch with Mysinotruk The Bolden off-road, passenger, and commercial truck inquiries. Our team is here to help you find the right vehicle.',
  openGraph: {
      title: 'Contact Us - Sinotruk Bolden Off-Road, Passenger & Commercial',
      description: 'Get in touch with Mysinotruk The Bolden off-road, passenger, and commercial truck inquiries. Our team is here to help you find the right vehicle.',
      url: 'https://www.mysinotruk.ae/contact-us',
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