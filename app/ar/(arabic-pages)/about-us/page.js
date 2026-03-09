
"use client";

import Image from "next/image";
import styles from "./AboutSinotrukSection.module.css";

import HeaderNav from "@/components/ar/client/HeaderNavClientAr";
import HeroSliderClient from "@/components/ar/client/pages/HeroSliderPages";

import Footer from "@/components/ar/client/FooterClient";
import RequestQuote from "@/components/demo/RequestQuote";

import ContactSection from "@/components/contactpage/ContactSection";
import LocationSection from "@/components/contactpage/LocationSection";



export const HERO_SLIDES = [
  {
    desktop: "/assets/about/about-banner.webp",
    mobile: "/assets/about/about-banner.webp",
    title: "",
    subtitle: "",
    align: "left",
    valign: "end",
    overlay: "rgba(0,0,0,0.3)",
    learnMoreHref: "",
    bookHref: "",
    className: "",
  },
];


export default function Page() {
  return (
    <>
      <HeaderNav />
      <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />

      <section className={styles.section}>
        <div className={styles.container}>
          {/* TOP INTRO */}
          <div className={styles.topGrid}>
            <div className={styles.leftTitleBox}>
              <h2 className={styles.bigTitle}>حول</h2>
            </div>

            <div className={styles.topContent}>
              <h3 className={styles.mainHeading}> سينوترك بولدن الإمارات</h3>

              <div className={styles.topColumns}>
                <p>
                   قامت شركة سينوتراك (Sinotruk) بتعيين رويال سويس أوتو تريدنج (Royal Swiss Auto Trading) كموزع حصري لمجموعة سيارات بيك اب سينوترك بولدن (Sinotruk Bolden) في دولة الإمارات العربية المتحدة، مما يعزز التزام العلامة التجارية طويل الأمد بسوق المركبات التجارية وسيارات الطرق الوعرة وسيارات الدفع الرباعي 4x4 والبيك اب في الدولة. وبدعم من عقود من الاستثمار العالمي في التصنيع المتقدم، والبحث والتطوير الداخلي، والشراكات الهندسية الدولية، تقدم سينوتراك خبرة مثبتة في المحركات، وأنظمة نقل الحركة، وأنظمة السلامة، ومتانة الهيكل إلى المنطقة.
                </p>

                <p>
                  يجمع هذا التحالف الاستراتيجي بين الإرث الهندسي الموثوق عالميًا لشركة سينوتراك، والذي أثبت كفاءته في الشرق الأوسط وأفريقيا وأوروبا وأمريكا الجنوبية وآسيا، وبين المعرفة الإقليمية العميقة والريادة الراسخة في قطاع السيارات لدى رويال سويس أوتو تريدنج.
                  <br />
                  <br />
                  ومن خلال الحضور الإقليمي القوي والخبرة المتخصصة في قطاع السيارات لدى رويال سويس أوتو تريدنج، يحصل عملاء سينوترك بولدن (Sinotruk Bolden) الإمارات على مركبات موثوقة، ودعم محلي احترافي، وثقة في الملكية طويلة الأمد داخل دولة الإمارات العربية المتحدة، وذلك عبر منصة mysinotruk.ae الرسمية.
                </p>
              </div>
            </div>
          </div>

          {/* FULL IMAGE */}
          <div className={styles.fullImageWrap}>
            <Image
              src="/assets/about/about-img1.webp"
              alt="Sinotruk Bolden pickup"
              width={1400}
              height={700}
              className={styles.fullImage}
            />
          </div>

          {/* BRAND HISTORY */}
          <div className={styles.twoColBlock}>
            <div className={styles.textBlock}>
              <div className={styles.logoTextWrap}>
                <img src="/assets/about/logo.webp" alt="Sinotruk Bolden" />
                {/* <div className={styles.sinotrukRed}>SINOTRUK</div>
                <div className={styles.boldenBlack}>BOLDEN</div> */}
              </div>

              <h3 className={styles.sectionHeading}>تاريخ علامة سينوترك بولدن</h3>

              <p>
                 تستمد علامة سينوترك بولدن قوتها من إرث صناعي راسخ مرتبط بتطور الصناعة في الصين. تأسست سينوتراك (SINOTRUK) عام 1956، وأصبحت أول مصنع للشاحنات الثقيلة في الصين. وعلى مدار ما يقارب سبعة عقود، صنعت تاريخًا باعتبارها أول منتج للشاحنات الثقيلة في البلاد.
              </p>

              <p>
                تحظى شاحنات HOWO الثقيلة، وشاحنات HOWO القلابة، ومركبات HOWO للإنشاءات والتعدين التابعة لسينوتراك بشعبية واسعة في أسواق التصدير العالمية، حيث صُممت لتحمل الظروف المناخية القاسية وأحمال العمل الشاقة.
              </p>

              <p>
                تمثل سينوترك بولدن (Sinotruk Bolden) الفصل الجديد من هذا الإرث، حيث تنقل خبرة الهندسة الثقيلة إلى قطاع المركبات التجارية الحديثة، والبيك أب، ومركبات الاستخدام المتعدد. صُممت سيارات بولدن مع مراعاة ظروف الاستخدام الواقعية، حيث تجمع بين المتانة الصناعية عالية التحمل والراحة المعاصرة وأنظمة السلامة والثقة في القيادة.
              </p>

              <p>
                وبفضل مجموعة مركزة تشمل الطرازات التجارية، وسياؤات الطرق الوعرة، وطرازات الركاب، تقدم سينوترك بولدن في الإمارات حلول تنقل عملية مخصصة للعمل، والمغامرة، والحياة اليومية، مع معلومات تفصيلية متاحة عبر موقع mysinotruk.ae.
              </p>
            </div>

            <div className={styles.sideImageWrap}>
              <Image
                src="/assets/about/about-img2.webp"
                alt="Building"
                width={900}
                height={1100}
                className={styles.sideImage}
              />
            </div>
          </div>

          {/* FULL IMAGE 2 */}
          <div className={styles.fullImageWrap}>
            <Image
              src="/assets/about/about-img3.webp"
              alt="Sinotruk rear view"
              width={1400}
              height={700}
              className={styles.fullImage}
            />
          </div>

          {/* ROYAL SWISS */}
          <div className={`${styles.twoColBlock} ${styles.reverseBlock}`}>
            <div className={styles.sideImageWrap}>
              <Image
                src="/assets/about/about-img4.webp"
                alt="Royal Swiss Auto Trading"
                width={900}
                height={1100}
                className={styles.sideImage}
              />
            </div>

            <div className={styles.textBlock}>
              <h3 className={styles.sectionHeading}>
                حول 
                <br />
                رويال سويس
                <br />
                اوتو تريدينج
              </h3>

              <p>
                 تُعد رويال سويس أوتو تريدنج شركة سيارات مقرها دولة الإمارات العربية المتحدة، تأسست على مبادئ الجودة والموثوقية وتعزيز ثقة العملاء على المدى الطويل. ومع توسع حضورها في المنطقة، تعمل الشركة ضمن منظومة متكاملة تجمع بين تجارة السيارات، وحلول الضمان، وخدمات التسويق المتخصصة، بهدف تقديم تجربة سيارات شاملة ومترابطة تغطي جميع مراحل رحلة العميل.
              </p>

              <p>
                انطلاقًا من التزامها الراسخ بالتميز التشغيلي، تعتمد رويال سويس أوتو تريدنج منظومة عمل منظمة وإجراءات تشغيلية واضحة مدعومة بنماذج خدمة محورها العميل، بما يضمن مستوى أداء ثابتًا وتجربة متسقة عبر جميع نقاط التواصل. ويُمكّنها نهجها المتكامل ومتعدد التخصصات من تلبية احتياجات الأفراد ومالكي المركبات، إلى جانب دعم العملاء التجاريين وقطاع الأساطيل، مع تركيز مستمر على الجودة والمتانة والكفاءة وتحقيق قيمة طويلة الأمد.
              </p>

              <p>
                وإلى جانب توسعها المستمر، تلتزم رويال سويس أوتو تريدنج بدعم حلول التنقل اليومي وتعزيزها داخل مجتمعاتها. ومن خلال الجمع بين الانضباط التشغيلي والممارسات المهنية المسؤولة، تمضي الشركة نحو نمو مستدام يرسّخ مكانتها محليًا ويعزز حضورها إقليميًا ودوليًا، بما يدعم انتشار علامة Sinotruk Bolden UAE عبر المنصة الرسمية mysinotruk.ae.
              </p>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </>
  );
}
