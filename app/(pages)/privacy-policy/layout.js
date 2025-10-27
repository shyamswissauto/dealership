export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/privacy-policy',
        languages: {
          'en': 'https://www.mysinotruk.ae/privacy-policy',
        },
    },
  title: 'Read Our Privacy Policy & Stay Informed',
  description: 'Learn how we protect your personal data and ensure transparency. Read our privacy policy to know your rights and our data practices',
  openGraph: {
      title: 'Read Our Privacy Policy & Stay Informed',
      description: 'Learn how we protect your personal data and ensure transparency. Read our privacy policy to know your rights and our data practices',
      url: 'https://www.mysinotruk.ae/privacy-policy',
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