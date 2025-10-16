export const metadata = {
  metadataBase: new URL('https://mysinotruk.ae'),
    alternates: {
        canonical: '/bolden-uae/',
        languages: {
          'en': 'https://mysinotruk.ae/bolden-uae/',
          'ar': 'https://mysinotruk.ae/bolden-uae-ar/',
        },
    },
  title: 'بولدن… قوتك في العمل ومغامرتك على كل طريق.',
  description: 'قدها مع بولدن! ضمان 10 سنوات، 0٪ دفعة أولى، تسجيل مجاني، وصيانة 5 سنوات. انطلق بثقة وامتلك القوة اليوم!',
  openGraph: {
      title: 'بولدن… قوتك في العمل ومغامرتك على كل طريق.',
      description: 'قدها مع بولدن! ضمان 10 سنوات، 0٪ دفعة أولى، تسجيل مجاني، وصيانة 5 سنوات. انطلق بثقة وامتلك القوة اليوم!',
      url: 'https://mysinotruk.ae/bolden-uae-ar/',
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
      locale: 'ar_AR',
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