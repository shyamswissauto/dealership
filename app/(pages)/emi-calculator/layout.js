export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/emi-calculator',
        languages: {
          'en': 'https://www.mysinotruk.ae/emi-calculator',
        },
    },
  title: 'EMI Calculator: Estimate Your Sinotruk Bolden Monthly Payment',
  description: 'Zero Down Payment Offer! Calculate your monthly EMI. Use our fast, free calculator to plan financing Instantly and drive your Bolden Vehicle today.',
  openGraph: {
      title: 'EMI Calculator: Estimate Your Sinotruk Bolden Monthly Payment',
      description: 'Zero Down Payment Offer! Calculate your monthly EMI. Use our fast, free calculator to plan financing Instantly and drive your Bolden Vehicle today.',
      url: 'https://www.mysinotruk.ae/emi-calculator',
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
      locale: 'en_US',
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