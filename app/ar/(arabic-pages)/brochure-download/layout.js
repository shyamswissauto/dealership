export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/ar/brochure-download',
        languages: {
          'en': 'https://www.mysinotruk.ae/brochure-download',
          'ar': 'https://www.mysinotruk.ae/ar/brochure-download',
        },
    },
  title: "تحميل كتيب Bolden الإمارات | مواصفات Sinotruk الرسمية – PDF",
  description: "تعرف على مواصفات وميزات سيارات Bolden من Sinotruk عبر كتيب رسمي شامل. تحميل مجاني وسريع لملف PDF يحتوي على جميع التفاصيل الفنية. حمّل نسختك الآن.",
  openGraph: {
      title: "تحميل كتيب Bolden الإمارات | مواصفات Sinotruk الرسمية – PDF",
      description: "تعرف على مواصفات وميزات سيارات Bolden من Sinotruk عبر كتيب رسمي شامل. تحميل مجاني وسريع لملف PDF يحتوي على جميع التفاصيل الفنية. حمّل نسختك الآن.",
      url: 'https://www.mysinotruk.ae/ar/brochure-download',
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