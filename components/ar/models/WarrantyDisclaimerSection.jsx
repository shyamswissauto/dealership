import styles from "./WarrantyDisclaimerSection.module.css";

export default function WarrantyDisclaimerSection({
  leftImage = "/assets/user/img/warranty-left.jpg",
  title = "Sinotruk Bolden Warranty & Services",
  description = "The Sinotruk Bolden Commercial is backed by a detailed ownership program designed to support long-term performance and operational reliability. The vehicle comes with a 10-year manufacturer warranty, along with an inclusive 5-year or 100,000 km service package, whichever comes first, offering strong value for commercial operators and fleet customers across the UAE.",
  description2 = "Visit Royal Swiss Auto Trading showroom to learn more about the Sinotruk Bolden Commercial, explore warranty and service benefits, and schedule a test drive.",
  description3 = "",
  description4 = "",
  description5 = "",
  disclaimerTitle = "إخلاء المسؤولية",
  disclaimerText = ` تخضع مواصفات وخيارات المركبات للتغيير حسب الطراز والتوفر. الصور والمعلومات لأغراض تسويقية فقط وهي عرضة للتغيير دون إشعار مسبق. تطبق الشروط والأحكام.`,
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
          {description3?.trim() && <p className={styles.desc}>{description3}</p>}
          {description4?.trim() && <p className={styles.desc}>{description4}</p>}
          {description5?.trim() && <p className={styles.desc}>{description5}</p>}


          <div className={styles.disclaimerBox}>
            <div className={styles.disclaimerHead}>{disclaimerTitle}</div>
            <p className={styles.disclaimerText}>{disclaimerText}</p>
          </div>

          
        </div>
      </div>
    </section>
  );
}