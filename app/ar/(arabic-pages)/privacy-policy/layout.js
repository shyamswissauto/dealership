export const metadata = {
  title: "سياسة الخصوصية Sinotruk Bolden الإمارات | حماية البيانات والأمن",
  description: "خصوصيتك مضمونة. اطّلع على سياسة الخصوصية الرسمية Sinotruk Bolden الإمارات لمعرفة التفاصيل الكاملة حول كيفية استخدام البيانات، وأمانها، وحمايتها.",
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