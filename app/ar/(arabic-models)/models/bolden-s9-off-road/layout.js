export const metadata = {
  title: "Bolden S9 Off-Road الإمارات | أقوى سيارات الطرق الوعرة",
  description: "Bolden S9 Off-Road تقدم أداءً قوياً على الرمال والجبال في الإمارات. سيارة مصممة للطرق الصعبة والكثبان الرملية مع تقنيات قيادة متقدمة. تمثل القوة والمتانة. اكتشف المواصفات واحجز تجربتك الآن.",
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



export default function BoldenS9Layout({ children }) {
  return (
    <div>
      {/* Layout styling or components like a header, sidebar, etc., can go here */}
      {children}
    </div>
  );
}