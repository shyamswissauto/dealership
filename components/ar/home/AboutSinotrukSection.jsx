import Image from "next/image";
import styles from "./AboutSinotrukSection.module.css";

export default function AboutSinotrukSection() {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.title}>
            حول سينوترك بولدن الإمارات
          </h2>

          <p className={styles.description}>
             قامت شركة سينوتراك (Sinotruk) بتعيين رويال سويس أوتو تريدنج (Royal Swiss Auto Trading) كموزع حصري لمجموعة سيارات بيك اب سينوترك بولدن (Sinotruk Bolden) في دولة الإمارات العربية المتحدة، مما يعزز التزام العلامة التجارية طويل الأمد بسوق المركبات التجارية وسيارات الطرق الوعرة وسيارات الدفع الرباعي 4x4 والبيك اب في الدولة. وبدعم من عقود من الاستثمار العالمي في التصنيع المتقدم، والبحث والتطوير الداخلي، والشراكات الهندسية الدولية، تقدم سينوتراك خبرة مثبتة في المحركات، وأنظمة نقل الحركة، وأنظمة السلامة، ومتانة الهيكل إلى المنطقة.
          </p>

          <p className={styles.description}>
            يجمع هذا التحالف الاستراتيجي بين الإرث الهندسي الموثوق عالميًا لشركة سينوتراك، والذي أثبت كفاءته في الشرق الأوسط وأفريقيا وأوروبا وأمريكا الجنوبية وآسيا، وبين المعرفة الإقليمية العميقة والريادة الراسخة في قطاع السيارات لدى رويال سويس أوتو تريدنج.
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