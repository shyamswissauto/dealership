import styles from "./WarrantyDisclaimerSection.module.css";

export default function WarrantyDisclaimerSection({
  leftImage = "/assets/user/img/warranty-left.jpg",
  title = "Sinotruk Bolden Warranty & Services",
  description = "The Sinotruk Bolden Commercial is backed by a detailed ownership program designed to support long-term performance and operational reliability. The vehicle comes with a 10-year manufacturer warranty, along with an inclusive 5-year or 100,000 km service package, whichever comes first, offering strong value for commercial operators and fleet customers across the UAE.",
  description2 = "Visit Royal Swiss Auto Trading showroom to learn more about the Sinotruk Bolden Commercial, explore warranty and service benefits, and schedule a test drive.",
  disclaimerTitle = "Disclaimer",
  disclaimerText = `Vehicle specifications and options are subject to change by model and availability. Images and information are for marketing purposes only and are subject to change without prior notice. Terms and conditions apply.`,
}) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Left image */}
        <div
          className={styles.left}
          style={{ backgroundImage: `url(${leftImage})` }}
          role="img"
          aria-label="Car warranty"
        >
          <div className={styles.imageOverlay} />
        </div>

        {/* Right content */}
        <div className={styles.right}>
          

          <h2 className={styles.title}>{title}</h2>
          <p className={styles.desc}>{description}</p>
          <p className={styles.desc}>{description2}</p>


          <div className={styles.disclaimerBox}>
            <div className={styles.disclaimerHead}>{disclaimerTitle}</div>
            <p className={styles.disclaimerText}>{disclaimerText}</p>
          </div>

          
        </div>
      </div>
    </section>
  );
}