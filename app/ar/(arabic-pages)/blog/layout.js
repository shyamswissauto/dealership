export const metadata = {
  title: "مدونة Bolden الإمارات | نصائح قيادة ومراجعات سيارات Sinotruk",
  description: "تعرف على قوّة وأداء سيارات Bolden عبر مقالات متخصصة من الوكيل الرسمي في الإمارات. نصائح صيانة، مقارنة الموديلات، مراجعات الشاحنات، وتحليل أداء من مصدر موثوق .",
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