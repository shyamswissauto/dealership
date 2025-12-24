export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/ar/models/bolden-s6-commercial',
        languages: {
          'en': 'https://www.mysinotruk.ae/models/bolden-s6-commercial',
          'ar': 'https://www.mysinotruk.ae/ar/models/bolden-s6-commercial',
        },
    },
  title: "شاحنة Bolden S6 Commercial في الإمارات | للاستخدام التجاري ",
  description: "اكتشف Bolden S6 Commercial في الإمارات، تقدم أداءً احترافياً للشركات والأفراد تتحمل الظروف الصعبة بفضل تصميم قوي ومحرك متين. احجز تجربة قيادة الآن.",
  openGraph: {
      title: "شاحنة Bolden S6 Commercial في الإمارات | للاستخدام التجاري ",
      description: "اكتشف Bolden S6 Commercial في الإمارات، تقدم أداءً احترافياً للشركات والأفراد تتحمل الظروف الصعبة بفضل تصميم قوي ومحرك متين. احجز تجربة قيادة الآن.",
      url: 'https://www.mysinotruk.ae/ar/models/bolden-s6-commercial',
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


export default function BoldenS9Layout({ children }) {
  return (
    <div>
      {/* Layout styling or components like a header, sidebar, etc., can go here */}
      {children}
    </div>
  );
}