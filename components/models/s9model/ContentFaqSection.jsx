"use client";

import { useState } from "react";
import styles from "./ContentFaqSection.module.css";

const faqData = [
    {
        question: "What services do you offer?",
        answer:
            "We offer a wide range of automotive services including diagnostics, mechanical repairs, maintenance, inspections, and premium car care solutions.",
    },
    {
        question: "Do you use genuine spare parts?",
        answer:
            "Yes, we use genuine or approved high-quality parts based on the service requirement and vehicle type.",
    },
    {
        question: "Can I book an appointment in advance?",
        answer:
            "Yes, you can book your appointment in advance to reduce waiting time and ensure faster service support.",
    },
    {
        question: "Do you provide warranty on repairs?",
        answer:
            "Yes, selected repair and service works include warranty coverage. The exact coverage depends on the service type.",
    },
];

function FaqItem({ item, isOpen, onToggle }) {
    return (
        <div className={styles.faqItem}>
            <button
                type="button"
                className={styles.faqQuestion}
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <span dangerouslySetInnerHTML={{ __html: item.question }} />
                <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}>
                    +
                </span>
            </button>

            <div className={`${styles.faqAnswerWrap} ${isOpen ? styles.open : ""}`}>
                <div
                    className={styles.faqAnswer}
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                />
            </div>
        </div>
    );
}

export default function ContentFaqSection({
    paragraphs = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer efficitur enim sit amet metus venenatis, volutpat aliquam sapien consequat. Maecenas nec nibh lacinia dolor finibus hendrerit id eu turpis. Curabitur fringilla vulputate lectus, tincidunt porta mauris consectetur ut. Maecenas sed nulla massa. Cras sed elit a erat commodo laoreet ac id enim. Sed semper maximus nunc quis convallis. Nulla nec ultricies arcu. Donec tempus nisi vel augue sodales cursus.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer efficitur enim sit amet metus venenatis, volutpat aliquam sapien consequat. Maecenas nec nibh lacinia dolor finibus hendrerit id eu turpis. Curabitur fringilla vulputate lectus, tincidunt porta mauris consectetur ut. Maecenas sed nulla massa. Cras sed elit a erat commodo laoreet ac id enim. Sed semper maximus nunc quis convallis. Nulla nec ultricies arcu. Donec tempus nisi vel augue sodales cursus.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer efficitur enim sit amet metus venenatis, volutpat aliquam sapien consequat. Maecenas nec nibh lacinia dolor finibus hendrerit id eu turpis. Curabitur fringilla vulputate lectus, tincidunt porta mauris consectetur ut. Maecenas sed nulla massa. Cras sed elit a erat commodo laoreet ac id enim. Sed semper maximus nunc quis convallis. Nulla nec ultricies arcu. Donec tempus nisi vel augue sodales cursus.",
    ],
    faqTitle = "Frequently Asked Questions",
    faqs = faqData,
}) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.contentCard}>
                    {/* {paragraphs.map((text, index) => (
                        <div
                            key={index}
                            className={styles.text}
                            dangerouslySetInnerHTML={{ __html: text }}
                        />
                    ))} */}

                    {paragraphs.map((text, index) => (
                        <p key={index} className={styles.text}>
                            {text}
                        </p>
                    ))}
                </div>

                <div className={styles.faqBlock}>
                    <h2 className={styles.faqTitle}>{faqTitle}</h2>

                    <div className={styles.faqList}>
                        {/* {faqs.map((item, index) => (
                            <FaqItem
                                key={index}
                                item={item}
                                isOpen={openIndex === index}
                                onToggle={() =>
                                    setOpenIndex(openIndex === index ? -1 : index)
                                }
                            />
                        ))} */}

                        {faqs.map((item, index) => (
                            <FaqItem
                                key={index}
                                item={item}
                                isOpen={openIndex === index}
                                onToggle={() =>
                                    setOpenIndex(openIndex === index ? -1 : index)
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}