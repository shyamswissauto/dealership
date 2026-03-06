import Image from "next/image";
import styles from "./AboutSinotrukSection.module.css";

export default function AboutSinotrukSection() {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.title}>
            About Sinotruk Bolden UAE
          </h2>

          <p className={styles.description}>
            Sinotruk has designated Royal Swiss Auto Trading as the exclusive distributor of the Sinotruk Bolden range in the UAE, reinforcing the brand’s long-term commitment to the region’s commercial and off-road vehicle market. Backed by decades of global investment in advanced manufacturing, in-house research and development, and international engineering partnerships, Sinotruk brings proven expertise in engines, drivetrains, safety systems, and chassis durability to the region.
          </p>

          <p className={styles.description}>
            This strategic alliance brings together Sinotruk’s globally trusted engineering legacy proven across the Middle East, Africa, Europe, CIS, South America, and Asia with Royal Swiss Auto Trading’s deep-rooted regional knowledge and established automotive leadership.
          </p>
        </div>

        <div className={styles.right}>
          <div className={styles.imageWrap}>
            <Image
              src="/assets/home/sinotruk-about-us.webp"
              alt="About Sinotruk Bolden UAE"
              fill
              className={styles.image}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}