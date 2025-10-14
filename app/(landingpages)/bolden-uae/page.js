
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/pages/HeroSliderPages";

import Footer from "@/components/client/FooterClient";
import RequestQuote from "@/components/demo/RequestQuote";
import LandingPageCommon from "@/components/form/landingpagecommon";

export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/landing-banner.webp",
    mobile:  "/assets/hero/landing-banner-m.webp",
    title:   "Drive the Future with Sinotruck",
    subtitle:"",
    align:   "center",
    overlay: "rgba(0,0,0,0.4)",
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
        
        <LandingPageCommon />       


        <Footer />        
      </>
    );
  }
  