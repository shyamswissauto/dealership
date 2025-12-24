export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/ar/blog',
        languages: {
          'en': 'https://www.mysinotruk.ae/blog',
          'ar': 'https://www.mysinotruk.ae/ar/blog',
        },
    },
  title: "مدونة Bolden الإمارات | نصائح قيادة ومراجعات سيارات Sinotruk",
  description: "تعرف على قوّة وأداء سيارات Bolden عبر مقالات متخصصة من الوكيل الرسمي في الإمارات. نصائح صيانة، مقارنة الموديلات، مراجعات الشاحنات، وتحليل أداء من مصدر موثوق .",
  openGraph: {
      title: "مدونة Bolden الإمارات | نصائح قيادة ومراجعات سيارات Sinotruk",
      description: "تعرف على قوّة وأداء سيارات Bolden عبر مقالات متخصصة من الوكيل الرسمي في الإمارات. نصائح صيانة، مقارنة الموديلات، مراجعات الشاحنات، وتحليل أداء من مصدر موثوق .",
      url: 'https://www.mysinotruk.ae/ar/blog',
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