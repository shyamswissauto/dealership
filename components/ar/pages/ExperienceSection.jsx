// app/components/ExperienceSection.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./ExperienceSection.module.css";
import TestDriveModal from "@/components/ar/TestDriveModal";

export default function ExperienceSection({
  eyebrow = " سينوتروك بولدن مصممة لطرق الإمارات. فضولي تعرف كيف أداؤها؟ جرّبها بنفسك.",
  titleTop = "من شوارع المدينة إلى دروب الصحراء — بيك أب بولدن جاهزة لأي تضاريس. ماذا عنك؟",
  titleBottom = "",
  body = `فرصتك لتجربة بيك أب تعمل بقدر ما تعمل أنت. سواء كنت تتنقّل للتوصيل داخل دبي أو تتقدّم عبر طرق العين الصحراوية، فإن سينوتروك بولدن مصممة للتعامل مع كل ذلك. وعند قيامك بتجربة القيادة، فأنت لا تختبر المواصفات فقط، بل تشعر بعزمها الحقيقي بنفسك، بالإضافة إلى اكتشاف معنى الراحة الحقيقية في بيك أب. من التحكم السلس إلى الاعتمادية القوية… هنا يلتقي الأداء بالعملية.
جاهز لتجربة قيادة سينوتروك بولدن؟ لدينا عملية حجز سهلة وبسيطة. بعد حجز موعدك، توجه إلى مركز تجربة القيادة وسيقوم فريقنا بشرح كل ميزة، والإجابة عن استفساراتك، والتأكد من أنك تختبر فعليًا ما يمكن لبولدن أن تقدمه. لا يوجد أي ضغط للشراء—فقط فرصة لمعرفة ما إذا كانت المركبة المناسبة لك. لأننا نؤمن تمامًا بأن أفضل طريقة لاختبار مزايا أي مركبة هي الجلوس خلف المقود.
`,
  ctaLabel = "احجز تجربة القيادة",
}) {

  const [open, setOpen] = useState(false);

  return (
    <>
    <section className={styles.wrap} aria-labelledby="exp-title-top">
      <div className={styles.container}>
        <h1 className={styles.title}>
          <span id="exp-title-top">{titleTop}</span>
          <br />
          <span className={styles.titleEmphasis}>{titleBottom}</span>
        </h1>

        <p className={styles.eyebrow}>{eyebrow}</p>

        <div className={styles.copy}>
          {body.split("\n").map((p, i) => (
            <p key={i}>{p.trim()}</p>
          ))}
        </div>

        

        <button onClick={() => setOpen(true)} className={styles.cta}>{ctaLabel}</button>
      </div>
    </section>
        {open && (
            <TestDriveModal
              onClose={() => setOpen(false)}
              modalImage="/assets/popup/book-test-drive-home.webp"
              carOptions={["Bolden Off-Road", "Bolden Passenger", "Bolden Commercial"]}
            />
          )}
    </>
  );
}
