export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/ar/special-offers',
        languages: {
          'en': 'https://www.mysinotruk.ae/special-offers',
          'ar': 'https://www.mysinotruk.ae/ar/special-offers',
        },
    },
  title: "عروض Bolden في الإمارات | أسعار خاصة وتمويل مرن",
  description: "لا تفوّت الفرصة! اكتشف أحدث عروض سينوتراك بولدن، وصفقاتها، وترقياتها على شاحنات Off-Road, Passenger & Commercial في الإمارات مع خيارات تقسيط وضمان إضافي. عروض لفترة محدودة!",
  openGraph: {
      title: "عروض Bolden في الإمارات | أسعار خاصة وتمويل مرن",
      description: "لا تفوّت الفرصة! اكتشف أحدث عروض سينوتراك بولدن، وصفقاتها، وترقياتها على شاحنات Off-Road, Passenger & Commercial في الإمارات مع خيارات تقسيط وضمان إضافي. عروض لفترة محدودة!",
      url: 'https://www.mysinotruk.ae/ar/special-offers',
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