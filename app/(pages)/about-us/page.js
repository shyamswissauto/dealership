
"use client";

import Image from "next/image";
import styles from "./AboutSinotrukSection.module.css";

import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/pages/HeroSliderPages";

import Footer from "@/components/client/FooterClient";
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
              <h2 className={styles.bigTitle}>ABOUT</h2>
            </div>

            <div className={styles.topContent}>
              <h3 className={styles.mainHeading}>SINOTRUK BOLDEN UAE</h3>

              <div className={styles.topColumns}>
                <p>
                  Sinotruk has designated Royal Swiss Auto Trading as the exclusive distributor of the Sinotruk Bolden range in the UAE, reinforcing the brand’s long-term commitment to the region’s commercial and off-road vehicle market. Backed by decades of global investment in advanced manufacturing, in-house research and development, and international engineering partnerships, Sinotruk brings proven expertise in engines, drivetrains, safety systems, and chassis durability to the region.
                </p>

                <p>
                  This strategic alliance brings together Sinotruk’s globally trusted engineering legacy proven across the Middle East, Africa, Europe, CIS, South America, and Asia with Royal Swiss Auto Trading’s deep-rooted regional knowledge and established automotive leadership
                  <br />
                  <br />
                  With Royal Swiss Auto Trading’s strong regional presence and automotive expertise, Sinotruk Bolden customers in the UAE receive reliable vehicles, local support, and long-term ownership confidence.
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

              <h3 className={styles.sectionHeading}>BRAND HISTORY</h3>

              <p>
                Sinotruk Bolden draws its strength from a powerful legacy rooted in China’s industrial evolution. SINOTRUK founded in 1956 and became China’s first manufacturer of heavy-duty trucks. For nearly seven decades made history as China’s first producer of heavy-duty trucks.
              </p>

              <p>
                Sinotruk’s HOWO Heavy-Duty Trucks, HOWO Dump Trucks, HOWO Construction & Mining Vehicles are popular in global export markets, built to handle extreme climates and demanding workloads.
              </p>

              <p>
                Sinotruk Bolden represents the next chapter of this legacy, bringing heavy-duty engineering expertise into the modern commercial, pickup, and utility vehicle segment. Designed with real-world conditions in mind, Bolden vehicles combine industrial-grade durability with contemporary comfort, safety, and driving confidence.
              </p>

              <p>
                With a focused lineup that includes Commercial, Off-Road, and Passenger models, Sinotruk Bolden delivers purpose-built mobility solutions for work, adventure, and everyday life.
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
                ABOUT
                <br />
                ROYAL SWISS
                <br />
                AUTO TRADING
              </h3>

              <p>
                Royal Swiss Auto Trading is a UAE-based automotive enterprise
                founded on the principles of quality, reliability, and long-term
                customer confidence. With a growing footprint across the region,
                the company operates at the intersection of automotive retail,
                warranty solutions, and integrated marketing services, delivering
                a seamless, end-to-end automotive experience.
              </p>

              <p>
                Driven by a commitment to operational excellence, Royal Swiss Auto
                Trading integrates structured processes and customer-centric
                service models to ensure consistent performance. Its multi-disciplinary
                approach enables the company to support both individual vehicle
                owners and large-scale commercial clients, with a focus on
                durability, efficiency, and long-term value.
              </p>

              <p>
                Beyond business growth, Royal Swiss Auto Trading is committed to
                enhancing everyday mobility for its communities. By combining
                operational excellence with responsible practices, the company
                actively works toward sustainable expansion while creating meaningful
                value at both local and international levels.
              </p>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </>
  );
}
