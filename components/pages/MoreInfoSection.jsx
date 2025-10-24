// app/components/MoreInfoSection.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./MoreInfoSection.module.css";

export default function MoreInfoSection({
    title = "Specs, Support, and More",
    items = [
        {
            title:"View Full Specs - Get detailed technical information before booking.",
            href: "/",
            img: "/assets/home/book-test-drive2.webp",
        },
        {
            title:"Compare Models - Explore your options and trim levels.",
            href: "/",
            img: "/assets/home/book-test-drive2.webp",
        },
        {
            title:"Need more help? - Talk to a specialist for personalized guidance.",
            href: "/",
            img: "/assets/home/book-test-drive2.webp",
        },
    ],
}) {
    return (
        <section className={styles.wrap} aria-labelledby="mi-title">
            <div className={styles.container}>
                <h2 id="mi-title" className={styles.heading}>{title}</h2>

                <div className={styles.grid}>
                    {items.map((it, i) => (
                        <div href={it.href || "#"} key={i} className={styles.card}>
                            <span className="sr-only">{it.title}</span>

                            <div className={styles.media}>
                                <Image
                                    src={it.img}
                                    alt=""
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
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
