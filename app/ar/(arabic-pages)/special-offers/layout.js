export const metadata = {
  title: "عروض Bolden في الإمارات | أسعار خاصة وتمويل مرن",
  description: "لا تفوّت الفرصة! اكتشف أحدث عروض سينوتراك بولدن، وصفقاتها، وترقياتها على شاحنات Off-Road, Passenger & Commercial في الإمارات مع خيارات تقسيط وضمان إضافي. عروض لفترة محدودة!",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};



export default function BoldenUAELayout({ children }) {
  return (
    <div>
      {/* Layout styling or components like a header, sidebar, etc., can go here */}
      {children}
    </div>
  );
}