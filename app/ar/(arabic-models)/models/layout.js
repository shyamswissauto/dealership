export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/ar/models',
        languages: {
          'en': 'https://www.mysinotruk.ae/models',
          'ar': 'https://www.mysinotruk.ae/ar/models',
        },
    },
  title: "سيارات Bolden في الإمارات | أفضل النماذج المتوفرة – Sinotruk UAE",
  description: "اكتشف تشكيلة سيارات Sinotruk Bolden في الإمارات: Off-Road، Passenger، Commercial. مقارنة سريعة للمزايا والأداء مع مواصفات تفصيلية وميزات الاستخدام القوي. احجز تجربة قيادة أو اطلب عرض سعر اليوم.",
  openGraph: {
      title: "سيارات Bolden في الإمارات | أفضل النماذج المتوفرة – Sinotruk UAE",
      description: "اكتشف تشكيلة سيارات Sinotruk Bolden في الإمارات: Off-Road، Passenger، Commercial. مقارنة سريعة للمزايا والأداء مع مواصفات تفصيلية وميزات الاستخدام القوي. احجز تجربة قيادة أو اطلب عرض سعر اليوم.",
      url: 'https://www.mysinotruk.ae/ar/models',
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