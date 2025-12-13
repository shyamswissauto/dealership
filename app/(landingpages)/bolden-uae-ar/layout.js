export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/bolden-uae',
        languages: {
          'en': 'https://www.mysinotruk.ae/bolden-uae',
          'ar': 'https://www.mysinotruk.ae/bolden-uae-ar',
        },
    },
  title: 'سيارات Bolden من Sinotruk | أفضل سيارات بيك أب 4×4 للطرقات الوعرة، والركاب، والتجارية في الإمارات.',
  description: 'Bolden توفر سيارات قوية بتقنيات Sinotruk العالمية لتناسب الطرق الوعرة والمدينة في الإمارات. تصميم متين وتجهيزات متقدمة للأفراد والشركات. استكشف الموديلات والتفاصيل.',
  openGraph: {
      title: 'سيارات Bolden من Sinotruk | أفضل سيارات بيك أب 4×4 للطرقات الوعرة، والركاب، والتجارية في الإمارات.',
      description: 'Bolden توفر سيارات قوية بتقنيات Sinotruk العالمية لتناسب الطرق الوعرة والمدينة في الإمارات. تصميم متين وتجهيزات متقدمة للأفراد والشركات. استكشف الموديلات والتفاصيل.',
      url: 'https://www.mysinotruk.ae/bolden-uae',
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