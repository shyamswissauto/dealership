"use client";

import Link from "next/link";
import styles from "./WhoWeAreSection.module.css";

export default function WhoWeAreSection() {
  return (
    <section className={`${styles.wrap} dirRtl`} aria-labelledby="who-title">
      <div className={styles.container}>
        <div className={styles.titlebox}>
            <h2 id="who-title" className={styles.title}>من نحن</h2>
            <p className={styles.kicker}>
              نحن شركة رويال سويس أوتو تريدينغ، الموزع المعتمد لشركة سينوتراك في الإمارات العربية المتحدة. نحن نقدم مركبات مصممة لتوفير القوة والراحة والموثوقية. نحن وجهتك المثالية للحصول على مركبات عالمية المستوى ودعم ما بعد البيع الاحترافي.
            </p>
            <p className={styles.kicker2}>
              اكتشف مركبات بولدن المصممة للعمل والعائلة والمغامرة.
            </p>
        </div>
        

        <div className={styles.grid}>
          
          <Link
            href="/"
            aria-label="Read about Our Journey"
            className={`${styles.card} ${styles.up}`}
            style={{ "--bg": "url('/assets/home/who-we-are.webp')" }} 
          >
            <span className={styles.overlay} aria-hidden="true" />
            <div className={styles.inner}>
              <span className={styles.heading}>رحلتنا</span>
              <span className={`${styles.desc} ${styles.fromBottom} dirRtl`}>
                بدأت شركة رويال سويس أوتو تريدينغ بهدف واحد: إعادة تعريف التنقل في الإمارات العربية المتحدة. وبفضل مركبات بولدن من سينوتراك، حققنا هذا الهدف. إن رحلتنا مبنية على الثقة والأداء والشغف بالتقدم.
              </span>
            </div>
          </Link>

          
          <Link
            href="/"
            aria-label="Read about Our Vision"
            className={`${styles.card} ${styles.down}`}
            style={{ "--bg": "url('/assets/home/who-we-are2.webp')" }} 
          >
            <span className={styles.overlay} aria-hidden="true" />
            <div className={styles.inner}>
              
              <span className={`${styles.desc} ${styles.fromTop} dirRtl`}>
                مهمتنا بسيطة: دفع عجلة التقدم في الإمارات العربية المتحدة بفضل مركبات سينوتراك الموثوقة وخدماتها التي تذهب إلى أبعد الحدود. نحن نؤمن إيمانًا راسخًا بأن نجاحنا مدعوم بالتزامنا بخدمة العملاء وبناء علاقات طويلة الأمد.
              </span>
              <span className={styles.heading}>رؤيتنا</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
