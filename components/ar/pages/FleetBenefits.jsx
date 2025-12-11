// app/components/FleetBenefits.jsx
"use client";

import Image from "next/image";
import styles from "./FleetBenefits.module.css";
import PromoGrid from "../modelList/PromoGrid";

export default function FleetBenefits({
  heading = `سواء كنت تدير خدمات توصيل، أو فرق عمل، أو عمليات يومية، فإن بيك أب بولدن مصممة للحفاظ على سير أسطولك — بثقة، وبأسعار مناسبة، وبقوة حقيقية. من الأداء القوي إلى المزايا الذكية التي تجعل كل رحلة أكثر سلاسة، بولدن هي الشريك الذي يستحقه عملك. جاهز للتطوير؟ خلّينا نجهّز أسطولك مع بولدن.`,
  items = [
    {
      icon: "/assets/icons/settings.svg",
      title: "مصممة لتلبية متطلبات الأساطيل",
      text: "بيك أب بولدن مُهندسة للتحمّل، والحمولة العالية، والأداء المستمر طوال اليوم.",
    },
    {
      icon: "/assets/icons/settings.svg",
      title: "أسعار مناسبة للأعمال",
      text: "باقات الأسطول لدينا تأتي بأسعار تنافسية وخيارات تمويل تسهّل عليك التوسّع.",
    },
    {
      icon: "/assets/icons/settings.svg",
      title: "صيانة سهلة ووقت توقف أقل",
      text: "شبكات الخدمة المتاحة وقطع الغيار القوية من بولدن تضمن بقاء أسطولك على الطريق.",
    },
    {
      icon: "/assets/icons/settings.svg",
      title: "خيارات تخصيص متنوعة",
      text: "اختر من عدة فئات وإضافات لتلبية احتياجات أسطولك بدقة.",
    },
    {
      icon: "/assets/icons/settings.svg",
      title: "دعم إدارة الأسطول",
      text: "أدوات التليماتكس ونظام تحديد المواقع. (GPS) الاختيارية تساعدك على مراقبة الاستخدام وتقليل التكاليف التشغيلية",
    },
    {
      icon: "/assets/icons/settings.svg",
      title: "مستشارو أسطول متخصصون",
      text: "فريقنا يعمل معك مباشرة للتخطيط والتسعير وتوفير المركبات المناسبة لعملك.",
    },
  ],
  ctaBand = "بيك أب جاهزة للأساطيل… لدفع عملك نحو الأمام",
}) {
  return (
    <section className={styles.wrap} aria-labelledby="fleet-title">
      <div className={styles.container}>
        <h2 id="fleet-title" className={styles.heading}>
          {heading}
        </h2>

        <div className={styles.grid}>
          {items.map((it, i) => (
            <div className={styles.cell} key={i}>
              {it.icon && (
                <div className={styles.icon}>
                  {/* swap to <img> if you don’t use Next/Image */}
                  <Image
                    src={it.icon}
                    alt={it.title}
                    width={56}
                    height={56}
                    priority={i < 3}
                  />
                </div>
              )}
              <h3 className={styles.title}>{it.title}</h3>
              <p className={styles.text}>{it.text}</p>
            </div>
          ))}
        </div>
      </div>

      <PromoGrid />

      <div className={styles.ctaBand}>
        <p className={styles.ctaText}>{ctaBand}</p>
      </div>
    </section>
  );
}
