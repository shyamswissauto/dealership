export const metadata = {
  title: "حلول Bolden للأعمال في الإمارات | شاحنات , واساطيل للشركات – MySinotruk",
  description: "Bolden Business تقدم حلولاً مخصصة للشركات في الإمارات، تشمل شاحنات قوية، سيارات تجارية، وخيارات أساطيل تناسب مختلف القطاعات. احصل على استشارة أو عرض سعر الآن.",
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