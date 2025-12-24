export const metadata = {
  metadataBase: new URL('https://www.mysinotruk.ae'),
    alternates: {
        canonical: '/ar/models/bolden-s7-passenger',
        languages: {
          'en': 'https://www.mysinotruk.ae/models/bolden-s7-passenger',
          'ar': 'https://www.mysinotruk.ae/ar/models/bolden-s7-passenger',
        },
    },
  title: "سيارة Bolden S7 Passenger في الامارات | قوة، فخامة، وتقنيات حديثة",
  description: "استكشف سيارة Bolden Passenger S7 في الإمارات بميزاتها العملية التي تجمع بين الفخامة والاداء القوي .تصميم عصري وتجهيزات متقدمةز مثالية للقيادة اليومية والعائلات",
  openGraph: {
      title: "سيارة Bolden S7 Passenger في الامارات | قوة، فخامة، وتقنيات حديثة",
      description: "استكشف سيارة Bolden Passenger S7 في الإمارات بميزاتها العملية التي تجمع بين الفخامة والاداء القوي .تصميم عصري وتجهيزات متقدمةز مثالية للقيادة اليومية والعائلات",
      url: 'https://www.mysinotruk.ae/ar/models/bolden-s7-passenger',
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