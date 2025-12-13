// app/components/MoreInfoSection.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./MoreInfoSection.module.css";

export default function MoreInfoSection({
    title = "المواصفات، الدعم، والمزيد",
    items = [
        {
            title:"عرض المواصفات الكاملة - احصل على معلومات تقنية مفصلة قبل الحجز.",
            href: "/ar/brochure-download",
            img: "/assets/pages/experience-view-spec.webp",
            alttext: "View Full Specs",
        },
        {
            title:"استكشف خياراتك والفئات المتوفر.- مقارنة الموديلات",
            href: "/ar/models",
            img: "/assets/pages/experience-compare-model.webp",
            alttext: "Compare Models",
        },
        {
            title:"تحتاج مساعدة؟ - تحدث إلى مختص للحصول على إرشاد مخصص.",
            href: "tel:+971561122500",
            img: "/assets/pages/experience-talk-specialist.webp",
            alttext: "Need more help?",
        },
    ],
}) {
    return (
        <section className={styles.wrap} aria-labelledby="mi-title">
            <div className={styles.container}>
                <h2 id="mi-title" className={styles.heading}>{title}</h2>

                <div className={styles.grid}>
                    {items.map((it, i) => (
                        <a href={it.href || "#"} key={i} className={styles.card}>
                            <span className="sr-only">{it.title}</span>

                            <div className={styles.media}>
                                <Image
                                    src={it.img}
                                    alt={it.alttext}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                    className={styles.img}
                                    priority={i === 0}
                                />
                                <div className={styles.overlay} />
                            </div>

                            <div className={styles.content}>
                                <p className={styles.cardText}>{it.title}</p>
                                {/* <span className={styles.arrow} aria-hidden>
                                    <svg className={styles.arrowIcon} viewBox="0 0 24 24" role="img" aria-hidden="true">
                                        <path d="M5 12h12M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span> */}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
