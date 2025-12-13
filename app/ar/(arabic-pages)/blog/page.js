
import styles from "./BlogList.module.css";

import HeaderNav from "@/components/ar/client/HeaderNavClientAr";

import Footer from "@/components/ar/client/FooterClient";
import HeroSlider from "@/components/ar/pages/HeroSliderBlogPages";
import BlogListing from "@/components/ar/blog/BlogListing";

export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/business-page.webp",
    mobile: "/assets/hero/listing-page-banner.webp",
    title: "المدوّنة",
    subtitle: "",
    align: "left",
    valign: "end",
    overlay: "rgba(0,0,0,0.6)",
    learnMoreHref: "",
    bookHref: "",
    className: "",
  },
];



export default function Page() {
  return (
    <>
      <HeaderNav />
      <HeroSlider slides={HERO_SLIDES} autoPlayMs={6000} />
      <main className={styles.wrap}>
 

        {/* Blog cards grid */}
        <section className={styles.listSection}>
          
          {/* <BlogListing /> */}
         <div className={styles.noBlogSection}>
          لا توجد مدوّنات بعد
        </div>

          
        </section>
      </main>
      <Footer />
    </>
  );
}


