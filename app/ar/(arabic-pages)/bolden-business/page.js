
import HeaderNav from "@/components/ar/client/HeaderNavClientAr";
import HeroSliderClient from "@/components/ar/client/pages/HeroSliderPages";

import Footer from "@/components/ar/client/FooterClient";
import FleetBenefits from "@/components/ar/pages/FleetBenefits";
import FleetTwoCol from "@/components/ar/pages/FleetTwoCol";
export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/business-page.webp",
    mobile:  "/assets/hero/listing-page-banner.webp",
    title:   "بولدن للأعمال",
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

        <FleetBenefits />
        <FleetTwoCol />

        

        

        <Footer />        
      </>
    );
  }
  