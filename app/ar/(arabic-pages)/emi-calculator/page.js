
import HeaderNav from "@/components/ar/client/HeaderNavClientAr";
import HeroSliderClient from "@/components/ar/client/pages/HeroSliderPages";

import Footer from "@/components/ar/client/FooterClient";
import EmiCalculator1 from "@/components/ar/models/EmiCalculator1";

export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/emi-calculator.webp",
    mobile:  "/assets/hero/listing-page-banner.webp",
    title:   "حاسبة التمويل",
    subtitle:"",
    align:   "left",
    valign:   "end",
    overlay: "rgba(0,0,0,0.6)",
    learnMoreHref: "",
    bookHref:      "",
    className:     "",
  },
];


export default function Page() {
  return (
      <>
        <HeaderNav />
        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />

        <EmiCalculator1 />
             


        <Footer />        
      </>
    );
  }
  