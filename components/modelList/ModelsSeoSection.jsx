"use client";

import Image from "next/image";

import styles from "./ModelsSeoSection.module.css";

const modelHighlights = [
    {
        title: "Lorem ipsum dolor sit amet",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer efficitur enim sit amet metus venenatis, volutpat aliquam sapien consequat. Maecenas nec nibh lacinia dolor finibus hendrerit id eu turpis.",
    },
    {
        title: "Lorem ipsum dolor sit amet",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer efficitur enim sit amet metus venenatis, volutpat aliquam sapien consequat. Maecenas nec nibh lacinia dolor finibus hendrerit id eu turpis.",
    },
    {
        title: "Lorem ipsum dolor sit amet",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer efficitur enim sit amet metus venenatis, volutpat aliquam sapien consequat. Maecenas nec nibh lacinia dolor finibus hendrerit id eu turpis.",
    },
];

export default function ModelsSeoSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* <div className={styles.topRow}>
                    <div className={styles.left}>
                        <span className={styles.eyebrow}>SINOTRUK BOLDEN UAE</span>

                        <h2 className={styles.title}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet.
                        </h2>
                    </div>

                    <div className={styles.right}>
                        <div className={styles.visualCard}>
                            <div className={styles.visualImageWrap}>
                                <Image
                                    src="/assets/home/feature3.webp"
                                    alt="Sinotruk Bolden range"
                                    fill
                                    className={styles.visualImage}
                                />
                            </div>

                            <div className={styles.visualOverlay}></div>

                            <div className={styles.visualContent}>
                                <h3 className={styles.visualTitle}>Lorem ipsum dolor sit amet Lorem ipsum dolor</h3>
                                <p className={styles.visualText}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer efficitur enim sit amet metus venenatis
                                </p>
                            </div>

                            <div className={styles.floatingInfo}>
                                <span>Lorem ipsum dolor sit</span>
                                <span>Lorem ipsum dolor sit</span>
                                <span>Lorem ipsum dolor sit</span>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className={styles.contentWrap}>
                    <div className={styles.contentCard}>
                        <h3>Sinotruk Bolden Pickups - Power, Performance, and Reliability in Every Drive</h3>
                        
                        <p>
                            The Sinotruk pickup truck UAE range is designed to meet the diverse needs of drivers, businesses, and adventure seekers across the region. Whether you are looking for a family pickup truck UAE, a commercial 1 ton pickup for business, or a pick-up truck for desert driving in the UAE, the Bolden lineup delivers power, durability, and versatility.
                        </p>

                        <p>
                            From rugged off-road exploration to daily commuting and demanding worksite tasks, Bolden pickup trucks combine advanced engineering with practical capability. Available in Double cabin, 4×4 and 4×2 configurations, with Manual Transmission and Automatic Transmission options, the lineup including Sinotruk Bolden Passenger, Off Road and Commercial models is built to handle both urban roads and challenging terrains.
                        </p>

                        <p>
                            Every Sinotruk pickup truck UAE is powered by a reliable diesel engine engineered for durability and performance. With high torque (420 Nm) and strong towing ability, these trucks are designed to handle heavy workloads while maintaining smooth driving dynamics.
                        </p>

                        <p>
                            This makes Bolden one of the best pick-up vehicles in the UAE for drivers seeking both strength and versatility.
                        </p>


                    </div>

                    <div className={styles.sidePanel}>
                        <div className={styles.sidePanelInner}>
                            <h3 className={styles.sideTitle}>The Bolden Advantage</h3>

                            <p>
                                Combining strength, versatility, and comfort, the Bolden lineup stands as one of the best pick-up vehicles in the UAE.
                            </p>

                            <p>
                                The  Bolden Passenger offers refined comfort, spacious seating, and advanced safety features, making it ideal for families and everyday driving.
                            </p>

                            <p>
                                The  Bolden Commercial is built for productivity, delivering strong payload capacity, durability, and reliability for demanding work environments.
                            </p>

                            <p>
                                For challenging terrains, the  Bolden Offroad provides enhanced suspension, superior traction, and rugged capability designed to conquer deserts and rough landscapes.
                            </p>

                            <p>
                                From powerful pickup truck UAE performance to practical everyday usability, Bolden trucks continue to redefine what a modern pickup can achieve.
                            </p>

                            {/* <ul className={styles.featureList}>
                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                            </ul> */}
                        </div>
                    </div>
                </div>

                {/* <div className={styles.highlightGrid}>
                    {modelHighlights.map((item, index) => (
                        <article key={index} className={styles.highlightCard}>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                        </article>
                    ))}
                </div> */}
            </div>
        </section>
    );
}