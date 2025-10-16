export const metadata = {
  metadataBase: new URL('https://mysinotruk.ae'),
    alternates: {
        canonical: '/bolden-uae/',
        languages: {
          'en': 'https://mysinotruk.ae/bolden-uae/',
          'ar': 'https://mysinotruk.ae/bolden-uae-ar/',
        },
    },
  title: 'سينوتروك بولدن  رفيقك المثالي في العمل والمغامرة. انطلق بثقة على كل طريق مع ماي سينوتروك في الإمارات.',
  description: 'قدها بطريقتك مع بولدن في الإمارات! استمتع بـ ضمان 10 سنوات، و0٪ دفعة أولى، وتسجيل مجاني، بالإضافة إلى خطة صيانة لمدة 5 سنوات.الفرصة بين يديك  امتلك القوة والثقة مع Sinotruk Bolden اليوم!',
  openGraph: {
      title: 'سينوتروك بولدن  رفيقك المثالي في العمل والمغامرة. انطلق بثقة على كل طريق مع ماي سينوتروك في الإمارات.',
      description: 'قدها بطريقتك مع بولدن في الإمارات! استمتع بـ ضمان 10 سنوات، و0٪ دفعة أولى، وتسجيل مجاني، بالإضافة إلى خطة صيانة لمدة 5 سنوات.الفرصة بين يديك  امتلك القوة والثقة مع Sinotruk Bolden اليوم!',
      url: 'https://mysinotruk.ae/bolden-uae-ar/',
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