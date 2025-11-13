export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/experience-the-drive',
        languages: {
          'en': 'https://www.mysinotruk.ae/experience-the-drive',
        },
    },
  title: 'Experience the Drive Sinotruk Bolden Off-Road, Passenger & Commercial UAE',
  description: 'Discover powerful performance, rugged capability and comfort designed for UAE roads, built to enhance every journey for work or adventure',
  openGraph: {
      title: 'Experience the Drive Sinotruk Bolden Off-Road, Passenger & Commercial UAE',
      description: 'Discover powerful performance, rugged capability and comfort designed for UAE roads, built to enhance every journey for work or adventure',
      url: 'https://www.mysinotruk.ae/experience-the-drive',
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