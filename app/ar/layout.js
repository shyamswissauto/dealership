export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/ar',
        languages: {
          'en': 'https://www.mysinotruk.ae',
          'ar': 'https://www.mysinotruk.ae/ar',
        },
    },
  title: "سيارات Sinotruk Bolden في الإمارات | الوكيل الرسمي – قوة ومتانة | MySinotruk UAE",
  description: "استكشف شاحنات وسيارات Sinotruk Bolden في الإمارات مع الوكيل الرسمي. تصميم قوي، نماذج متعددة، للاستخدام القوي والطرق الوعرة.عروض تمويل حصرية ودعم كامل داخل الدولة. احجز تجربة قيادة واحصل على أفضل سعر اليوم.",
  openGraph: {
      title: "سيارات Sinotruk Bolden في الإمارات | الوكيل الرسمي – قوة ومتانة | MySinotruk UAE",
      description: "استكشف شاحنات وسيارات Sinotruk Bolden في الإمارات مع الوكيل الرسمي. تصميم قوي، نماذج متعددة، للاستخدام القوي والطرق الوعرة.عروض تمويل حصرية ودعم كامل داخل الدولة. احجز تجربة قيادة واحصل على أفضل سعر اليوم.",
      url: 'https://www.mysinotruk.ae/ar',
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

export default function HomeLayout({ children }) {
  return (
    <div>
      {/* Layout styling or components like a header, sidebar, etc., can go here */}
      {children}
    </div>
  );
}