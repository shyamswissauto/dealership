
export const metadata = {
  title: "سيارات Sinotruk Bolden في الإمارات | الوكيل الرسمي – قوة ومتانة | MySinotruk UAE",
  description: "استكشف شاحنات وسيارات Sinotruk Bolden في الإمارات مع الوكيل الرسمي. تصميم قوي، نماذج متعددة، للاستخدام القوي والطرق الوعرة.عروض تمويل حصرية ودعم كامل داخل الدولة. احجز تجربة قيادة واحصل على أفضل سعر اليوم.",
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

export default function HomeLayout({ children }) {
  return (
    <div>
      {/* Layout styling or components like a header, sidebar, etc., can go here */}
      {children}
    </div>
  );
}