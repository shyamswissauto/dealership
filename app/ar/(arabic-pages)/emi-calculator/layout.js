export const metadata = {
  title: "حاسبة أقساط Sinotruk Bolden | احسب قسط سيارتك في الإمارات",
  description: "عرض بدون دفعة أولى! احسب القسط الشهري بسهولة. استخدم حاسبتنا السريعة والمجانية للتخطيط للتمويل فورًا، وابدأ قيادة مركبتك Bolden اليوم.",
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