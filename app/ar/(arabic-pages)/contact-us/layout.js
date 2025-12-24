export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/ar/contact-us',
        languages: {
          'en': 'https://www.mysinotruk.ae/contact-us',
          'ar': 'https://www.mysinotruk.ae/ar/contact-us',
        },
    },
  title: "اتصل بـ Sinotruk الإمارات | تواصل مع الوكيل الرسمي – MySinotruk",
  description: "نحن هنا لمساعدتك. تواصل مع فريق Sinotruk Bolden في الإمارات للاستفسارات، عروض الأسعار، وتجارب القيادة.تواصل الآن مع الوكيل الرسمي للحصول على المساعدة الفورية.",
  openGraph: {
      title: "اتصل بـ Sinotruk الإمارات | تواصل مع الوكيل الرسمي – MySinotruk",
      description: "نحن هنا لمساعدتك. تواصل مع فريق Sinotruk Bolden في الإمارات للاستفسارات، عروض الأسعار، وتجارب القيادة.تواصل الآن مع الوكيل الرسمي للحصول على المساعدة الفورية.",
      url: 'https://www.mysinotruk.ae/ar/contact-us',
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