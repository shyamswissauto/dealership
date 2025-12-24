export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/ar/experience-the-drive',
        languages: {
          'en': 'https://www.mysinotruk.ae/experience-the-drive',
          'ar': 'https://www.mysinotruk.ae/ar/experience-the-drive',
        },
    },
  title: "احجز تجربة قيادة Bolden | اكتشف قوة وأداء سيارات Sinotruk الإمارات",
  description: "احجز تجربة قيادة لسيارات Bolden من Sinotruk في الإمارات واكتشف قوة الأداء على الطرق الوعرة والمدينة. تجربة مجانية مع الوكيل الرسمي. سجّل الآن وانطلق بالBolden.",
  openGraph: {
      title: "احجز تجربة قيادة Bolden | اكتشف قوة وأداء سيارات Sinotruk الإمارات",
      description: "احجز تجربة قيادة لسيارات Bolden من Sinotruk في الإمارات واكتشف قوة الأداء على الطرق الوعرة والمدينة. تجربة مجانية مع الوكيل الرسمي. سجّل الآن وانطلق بالBolden.",
      url: 'https://www.mysinotruk.ae/ar/experience-the-drive',
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