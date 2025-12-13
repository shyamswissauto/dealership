export const metadata = {
  title: "Bolden Connect الإمارات | قنوات التواصل والدعم – Sinotruk",
  description: "Connect صفحة مخصصة لتواصلك مع فريق Sinotruk Bolden الإمارات. استفسارات، دعم، وتجربة قيادة—all in one place. أرسل طلبك وسنعود إليك فوراً.",
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