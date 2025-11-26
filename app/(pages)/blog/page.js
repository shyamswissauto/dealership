
import styles from "./BlogList.module.css";

import HeaderNav from "@/components/client/HeaderNavClient";

import Footer from "@/components/client/FooterClient";
import HeroSlider from "@/components/pages/HeroSliderBlogPages";
import BlogListing from "@/components/blog/BlogListing";

export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/business-page.webp",
    mobile: "/assets/hero/listing-page-banner.webp",
    title: "Our Blogs",
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
          
          <BlogListing />
         

          
        </section>
      </main>
      <Footer />
    </>
  );
}


