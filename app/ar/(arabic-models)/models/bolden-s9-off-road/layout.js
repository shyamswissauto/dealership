export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/ar/models/bolden-s9-off-road',
        languages: {
          'en': 'https://www.mysinotruk.ae/models/bolden-s9-off-road',
          'ar': 'https://www.mysinotruk.ae/ar/models/bolden-s9-off-road',
        },
    },
  title: "Bolden S9 Off-Road الإمارات | أقوى سيارات الطرق الوعرة",
  description: "Bolden S9 Off-Road تقدم أداءً قوياً على الرمال والجبال في الإمارات. سيارة مصممة للطرق الصعبة والكثبان الرملية مع تقنيات قيادة متقدمة. تمثل القوة والمتانة. اكتشف المواصفات واحجز تجربتك الآن.",
  openGraph: {
      title: "Bolden S9 Off-Road الإمارات | أقوى سيارات الطرق الوعرة",
      description: "Bolden S9 Off-Road تقدم أداءً قوياً على الرمال والجبال في الإمارات. سيارة مصممة للطرق الصعبة والكثبان الرملية مع تقنيات قيادة متقدمة. تمثل القوة والمتانة. اكتشف المواصفات واحجز تجربتك الآن.",
      url: 'https://www.mysinotruk.ae/ar/models/bolden-s9-off-road',
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