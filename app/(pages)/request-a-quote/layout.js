export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/request-a-quote',
        languages: {
          'en': 'https://www.mysinotruk.ae/request-a-quote',
        },
    },
  title: 'Request a Quote: Get the Best Bolden Sinotruk Price in UAE',
  description: 'Ready to Buy? Get the Exclusive price on a Brand New Sinotruk Bolden Models Today. Submit your quick inquiry to receive best price for personal or fleet needs.',
  openGraph: {
      title: 'Request a Quote: Get the Best Bolden Sinotruk Price in UAE',
      description: 'Ready to Buy? Get the Exclusive price on a Brand New Sinotruk Bolden Models Today. Submit your quick inquiry to receive best price for personal or fleet needs.',
      url: 'https://www.mysinotruk.ae/request-a-quote',
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