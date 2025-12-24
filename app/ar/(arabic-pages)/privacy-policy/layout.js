export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/ar/privacy-policy',
        languages: {
          'en': 'https://www.mysinotruk.ae/privacy-policy',
          'ar': 'https://www.mysinotruk.ae/ar/privacy-policy',
        },
    },
  title: "سياسة الخصوصية Sinotruk Bolden الإمارات | حماية البيانات والأمن",
  description: "خصوصيتك مضمونة. اطّلع على سياسة الخصوصية الرسمية Sinotruk Bolden الإمارات لمعرفة التفاصيل الكاملة حول كيفية استخدام البيانات، وأمانها، وحمايتها.",
  openGraph: {
      title: "سياسة الخصوصية Sinotruk Bolden الإمارات | حماية البيانات والأمن",
      description: "خصوصيتك مضمونة. اطّلع على سياسة الخصوصية الرسمية Sinotruk Bolden الإمارات لمعرفة التفاصيل الكاملة حول كيفية استخدام البيانات، وأمانها، وحمايتها.",
      url: 'https://www.mysinotruk.ae/ar/privacy-policy',
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