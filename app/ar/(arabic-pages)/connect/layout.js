export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/ar/connect',
        languages: {
          'en': 'https://www.mysinotruk.ae/connect',
          'ar': 'https://www.mysinotruk.ae/ar/connect',
        },
    },
  title: "Bolden Connect الإمارات | قنوات التواصل والدعم – Sinotruk",
  description: "Connect صفحة مخصصة لتواصلك مع فريق Sinotruk Bolden الإمارات. استفسارات، دعم، وتجربة قيادة—all in one place. أرسل طلبك وسنعود إليك فوراً.",
  openGraph: {
      title: "Bolden Connect الإمارات | قنوات التواصل والدعم – Sinotruk",
      description: "Connect صفحة مخصصة لتواصلك مع فريق Sinotruk Bolden الإمارات. استفسارات، دعم، وتجربة قيادة—all in one place. أرسل طلبك وسنعود إليك فوراً.",
      url: 'https://www.mysinotruk.ae/ar/connect',
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