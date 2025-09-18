export const metadata = {
  metadataBase: new URL('https://mysinotruk.ae'),
    alternates: {
        canonical: '/sinotruk-vgv-u75-plus/',
        languages: {
          'en': 'https://mysinotruk.ae/models/sinotruk-vgv-u75-plus/',
          'ar': 'https://mysinotruk.ae/ar/models/sinotruk-vgv-u75-plus/',
        },
    },
  title: 'Sinotruk VGV U75 Plus',
  description: 'Sinotruk VGV U75 Plus',
  openGraph: {
      title: 'Sinotruk VGV U75 Plus',
      description: 'Sinotruk VGV U75 Plus',
      url: 'https://mysinotruk.ae/models/sinotruk-vgv-u75-plus/',
      siteName: 'www.mysinotruk.ae',
      images: [
        {
          url: 'assets/images/og/sinotruk-vgv-u75-plus.png',
          width: 800,
          height: 600,
        },
        {
          url: 'assets/images/og/sinotruk-vgv-u75-plus.png',
          width: 1800,
          height: 1600,
          alt: 'Sinotruk VGV U75 Plus',
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