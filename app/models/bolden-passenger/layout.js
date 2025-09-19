export const metadata = {
  metadataBase: new URL('https://mysinotruk.ae'),
    alternates: {
        canonical: '/sinotruk-vgv-u70-pro/',
        languages: {
          'en': 'https://mysinotruk.ae/models/sinotruk-vgv-u70-pro/',
          'ar': 'https://mysinotruk.ae/ar/models/sinotruk-vgv-u70-pro/',
        },
    },
  title: 'Sinotruk VGV U70 Pro',
  description: 'Sinotruk VGV U70 Pro',
  openGraph: {
      title: 'Sinotruk VGV U70 Pro',
      description: 'Sinotruk VGV U70 Pro',
      url: 'https://mysinotruk.ae/models/sinotruk-vgv-u70-pro/',
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
          alt: 'Sinotruk VGV U70 Pro',
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