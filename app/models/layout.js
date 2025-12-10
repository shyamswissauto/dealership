export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/models',
        languages: {
          'en': 'https://www.mysinotruk.ae/models',
        },
    },
  title: 'Explore Sinotruk Bolden – 4×4 Off-Road, Passenger & Commercial Trucks',
  description: 'See the full lineup of Sinotruk Bolden pickup trucks. Compare specs for the rugged Off-Road, powerful Commercial, and passenger. Book your Test Drive Today!',
  openGraph: {
      title: 'Explore Sinotruk Bolden – 4×4 Off-Road, Passenger & Commercial Trucks',
      description: 'See the full lineup of Sinotruk Bolden pickup trucks. Compare specs for the rugged Off-Road, powerful Commercial, and passenger. Book your Test Drive Today!',
      url: 'https://www.mysinotruk.ae/models',
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



export default function BoldenS9Layout({ children }) {
  return (
    <div>
      {/* Layout styling or components like a header, sidebar, etc., can go here */}
      {children}
    </div>
  );
}