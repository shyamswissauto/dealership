export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/ar/bolden-business',
        languages: {
          'en': 'https://www.mysinotruk.ae/bolden-business',
          'ar': 'https://www.mysinotruk.ae/ar/bolden-business',
        },
    },
  title: "حلول Bolden للأعمال في الإمارات | شاحنات , واساطيل للشركات – MySinotruk",
  description: "Bolden Business تقدم حلولاً مخصصة للشركات في الإمارات، تشمل شاحنات قوية، سيارات تجارية، وخيارات أساطيل تناسب مختلف القطاعات. احصل على استشارة أو عرض سعر الآن.",
  openGraph: {
      title: "حلول Bolden للأعمال في الإمارات | شاحنات , واساطيل للشركات – MySinotruk",
      description: "Bolden Business تقدم حلولاً مخصصة للشركات في الإمارات، تشمل شاحنات قوية، سيارات تجارية، وخيارات أساطيل تناسب مختلف القطاعات. احصل على استشارة أو عرض سعر الآن.",
      url: 'https://www.mysinotruk.ae/ar/bolden-business',
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