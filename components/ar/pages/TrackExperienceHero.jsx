// app/components/TrackExperienceHero.jsx
"use client";

import Image from "next/image";
import styles from "./TrackExperienceHero.module.css";

export default function TrackExperienceHero({
  imgSrc = "/assets/hero/landing-banner.webp", // replace with your image
  eyebrow = "أينما تأخذك الحياة… بولدن معك.",
  titleTop = "ليست قوية فقط — سينوتروك بولدن مصممة للطريق الذي يناسبك",
  titleBottom = "Aliquam erat",
  body = ` سواء كنت تنقل البضائع عبر شوارع المدينة أو تتخطى الطرق الصحراوية الوعرة، فإن سينوتروك بولدن مصممة لتواكب وتيرتك. ستجدها شريكًا يعتمد عليه، يناسب يوم عملك كما يناسب يوم عطلتك. وقد تم تصميمها لتحمّل طرق الإمارات القاسية وتضاريسها المتنوعة. عملًا كان أم ترفيهًا — بولدن مصممة لتبقيك مرتاحًا، ممسكًا بزمام التحكم، ومنطلقًا بقوة.`,
  ctaLabel = "Discover more",
  onCtaClick = () => {},
}) {
  return (
    <section className={styles.hero} aria-labelledby="track-title-top">
      {/* Background image */}
      <div className={styles.bg}>
        <Image
          src={imgSrc}
          alt="Experience"
          fill
          priority
          sizes="100vw"
          className={styles.bgImg}
        />
        <div className={styles.overlay} />
      </div>

      {/* Content */}
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h1 className={styles.title}>
            <span id="track-title-top">{titleTop}</span>
            {/* <br />
            <span className={styles.titleEmphasis}>{titleBottom}</span> */}
          </h1>

          <p className={styles.eyebrow}>{eyebrow}</p>

          <p className={styles.body}>{body}</p>

          {/* <button className={styles.cta} onClick={onCtaClick}>
            {ctaLabel}
          </button> */}
        </div>
      </div>
    </section>
  );
}
