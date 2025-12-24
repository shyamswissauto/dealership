"use client";

import styles from "./AboutThreeCol.module.css";

export default function AboutThreeCol({
  leftKicker = "ABOUT SINOTRUK UAE",
  leftTitle = `SINOTRUK has exclusively partnered with Swiss Auto Trading to introduce the SINOTRUK brand to the UAE, marking a milestone in the region’s automotive landscape.`,
  leftText = `This exclusive partnership combines decades of extensive experience in the industry, driven by a shared commitment to delivering exceptional vehicles at highly competitive prices. This collaboration ensures that customers in the UAE enjoy both unparalleled value and complete peace of mind.`,
  buttonLabel = "About Us",
  buttonHref = "/about",
  midKicker = "SINOTRUK BRAND HISTORY",
  midText = `SINOTRUK is part of a globally recognized automotive group based in China, boasting decades of expertise in automotive engineering. With an extensive portfolio of both self-owned and joint-venture brands, SINOTRUK operates independent subsidiaries that specialize in diverse vehicle segments.

From its inception, SINOTRUK was designed to meet the evolving needs of modern consumers, particularly those seeking adventure, versatility, and comfort in their driving experience.

SINOTRUK quickly established itself as a key player in the SUV and crossover market, targeting families, urban explorers, and young professionals. Its focus on cutting-edge technology, intelligent features, and stylish design set the brand apart, offering a unique combination of performance, luxury, and affordability.

SINOTRUK’s rapid growth is driven by its core philosophy of "Travel+"—a vision to provide users with more than just a vehicle, but a platform for a lifestyle centered around exploration and enjoyment. This vision has led to continuous innovation in design, smart driving technology, and connectivity, ensuring that SINOTRUK stays ahead of market trends and meets the demands of a tech-savvy and travel-oriented consumer base.`,
  rightKicker = "ABOUT Swiss Auto Trading",
  rightText = `Swiss Auto Trading is a UAE-based conglomerate with a steadfast commitment to excellence, innovation, and integrity across a diverse portfolio that includes Automotive, E-commerce, Investments, and Real Estate & Contracting.

The group prides itself on enhancing the quality of life within the communities it serves while continuously seeking avenues for growth and making a positive impact both locally and globally.

With visionary expansion plans, Swiss Auto Trading is poised to expand across various industries, aiming to operate over 20 strategically located facilities across the UAE by the end of 2024. Their dedication to excellence and teamwork drives their mission to foster growth and deliver outstanding results across all sectors they are involved in.`,
}) {
  return (
    <section className={styles.wrap} aria-labelledby="about-3col-title">
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* LEFT */}
          <div className={styles.col}>
            <p className={styles.kicker}>Lorem ipsum dolor sit amet</p>

            <h2 id="about-3col-title" className={styles.bigTitle}>
              Mauris a velit luctus, ornare leo condimentum, efficitur purus. Sed imperdiet erat sit amet velit malesuada, ut luctus nibh dapibus.
            </h2>

            <p className={styles.body}>
                Nullam nibh erat, pellentesque nec orci ac, ultricies porta dolor. Nunc id tempus mauris. In hac habitasse platea dictumst. Integer eros diam, elementum eget fermentum tristique, rhoncus eu lacus. Phasellus nec lorem quam. Nullam nibh erat, pellentesque nec orci ac, ultricies porta dolor. Nunc id tempus mauris. In hac habitasse platea dictumst. Integer eros diam, elementum eget fermentum tristique, rhoncus eu lacus. Phasellus nec lorem quam.
            </p>

           {/*  <a className={styles.btn} href={buttonHref}>
              {buttonLabel}
            </a> */}
          </div>

          {/* MIDDLE */}
          <div className={styles.col}>
            <p className={styles.kickerCenter}>
                Nam laoreet id orci vitae mollis
            </p>
            <p className={styles.body}>
                Nunc id tempus mauris. In hac habitasse platea dictumst. Integer eros diam, elementum eget fermentum tristique, rhoncus eu lacus. Phasellus nec lorem quam. Nam semper ex laoreet, faucibus mi a, viverra est. Sed vel sagittis augue. Nam sodales massa felis, quis placerat velit sagittis in.
            </p>
            <p className={styles.body}>
                Nunc id tempus mauris. In hac habitasse platea dictumst. Integer eros diam, elementum eget fermentum tristique, rhoncus eu lacus. Phasellus nec lorem quam. Nam semper ex laoreet, faucibus mi a, viverra est. Sed vel sagittis augue. Nam sodales massa felis, quis placerat velit sagittis in.
            </p>
            <p className={styles.body}>
                Nunc id tempus mauris. In hac habitasse platea dictumst. Integer eros diam, elementum eget fermentum tristique, rhoncus eu lacus. Phasellus nec lorem quam. Nam semper ex laoreet, faucibus mi a, viverra est. Sed vel sagittis augue. Nam sodales massa felis, quis placerat velit sagittis in.
            </p>
          </div>

          {/* RIGHT */}
          <div className={styles.col}>
            <p className={styles.kickerCenter}>
                Nam laoreet id orci vitae mollis
            </p>
            <p className={styles.body}>
                Nunc id tempus mauris. In hac habitasse platea dictumst. Integer eros diam, elementum eget fermentum tristique, rhoncus eu lacus. Phasellus nec lorem quam. Nam semper ex laoreet, faucibus mi a, viverra est. Sed vel sagittis augue. Nam sodales massa felis, quis placerat velit sagittis in.
            </p>
            <p className={styles.body}>
                Nunc id tempus mauris. In hac habitasse platea dictumst. Integer eros diam, elementum eget fermentum tristique, rhoncus eu lacus. Phasellus nec lorem quam. Nam semper ex laoreet, faucibus mi a, viverra est. Sed vel sagittis augue. Nam sodales massa felis, quis placerat velit sagittis in.
            </p>
            <p className={styles.body}>
                Nunc id tempus mauris. In hac habitasse platea dictumst. Integer eros diam, elementum eget fermentum tristique, rhoncus eu lacus. Phasellus nec lorem quam. Nam semper ex laoreet, faucibus mi a, viverra est. Sed vel sagittis augue. Nam sodales massa felis, quis placerat velit sagittis in.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
