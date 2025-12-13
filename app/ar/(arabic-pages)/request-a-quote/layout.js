export const metadata = {
  title: "طلب عرض سعري لسيارات Bolden | الوكيل الرسمي Sinotruk الإمارات",
  description: "احصل على أفضل عرض سعر لسيارات Bolden في الإمارات مع تمويل مرن وضمان من الوكيل الرسمي. أدخل بياناتك الآن واحصل على تسعير فوري يناسب احتياجك.",
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