export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/ar/emi-calculator',
        languages: {
          'en': 'https://www.mysinotruk.ae/emi-calculator',
          'ar': 'https://www.mysinotruk.ae/ar/emi-calculator',
        },
    },
  title: "حاسبة أقساط Sinotruk Bolden | احسب قسط سيارتك في الإمارات",
  description: "عرض بدون دفعة أولى! احسب القسط الشهري بسهولة. استخدم حاسبتنا السريعة والمجانية للتخطيط للتمويل فورًا، وابدأ قيادة مركبتك Bolden اليوم.",
  openGraph: {
      title: "حاسبة أقساط Sinotruk Bolden | احسب قسط سيارتك في الإمارات",
      description: "عرض بدون دفعة أولى! احسب القسط الشهري بسهولة. استخدم حاسبتنا السريعة والمجانية للتخطيط للتمويل فورًا، وابدأ قيادة مركبتك Bolden اليوم.",
      url: 'https://www.mysinotruk.ae/ar/emi-calculator',
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