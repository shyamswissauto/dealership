export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/ar/request-a-quote',
        languages: {
          'en': 'https://www.mysinotruk.ae/request-a-quote',
          'ar': 'https://www.mysinotruk.ae/ar/request-a-quote',
        },
    },
  title: "طلب عرض سعري لسيارات Bolden | الوكيل الرسمي Sinotruk الإمارات",
  description: "احصل على أفضل عرض سعر لسيارات Bolden في الإمارات مع تمويل مرن وضمان من الوكيل الرسمي. أدخل بياناتك الآن واحصل على تسعير فوري يناسب احتياجك.",
  openGraph: {
      title: "طلب عرض سعري لسيارات Bolden | الوكيل الرسمي Sinotruk الإمارات",
      description: "احصل على أفضل عرض سعر لسيارات Bolden في الإمارات مع تمويل مرن وضمان من الوكيل الرسمي. أدخل بياناتك الآن واحصل على تسعير فوري يناسب احتياجك.",
      url: 'https://www.mysinotruk.ae/ar/request-a-quote',
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