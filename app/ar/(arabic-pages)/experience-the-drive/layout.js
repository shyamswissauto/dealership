export const metadata = {
  title: "احجز تجربة قيادة Bolden | اكتشف قوة وأداء سيارات Sinotruk الإمارات",
  description: "احجز تجربة قيادة لسيارات Bolden من Sinotruk في الإمارات واكتشف قوة الأداء على الطرق الوعرة والمدينة. تجربة مجانية مع الوكيل الرسمي. سجّل الآن وانطلق بالBolden.",
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