
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/pages/HeroSliderPages";

import Footer from "@/components/client/FooterClient";
import RequestQuote from "@/components/demo/RequestQuote";
import FleetBenefits from "@/components/pages/FleetBenefits";
import FleetTwoCol from "@/components/pages/FleetTwoCol";
import EmiCalculator1 from "@/components/models/EmiCalculator1";

export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/business-page.webp",
    mobile:  "/assets/hero/listing-page-banner.webp",
    title:   "BOLDEN BUSINESS",
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
  