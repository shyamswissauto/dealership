export const metadata = {
  title: "اتصل بـ Sinotruk الإمارات | تواصل مع الوكيل الرسمي – MySinotruk",
  description: "نحن هنا لمساعدتك. تواصل مع فريق Sinotruk Bolden في الإمارات للاستفسارات، عروض الأسعار، وتجارب القيادة.تواصل الآن مع الوكيل الرسمي للحصول على المساعدة الفورية.",
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