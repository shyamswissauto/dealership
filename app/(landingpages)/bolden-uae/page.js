
import HeaderNav from "@/components/client/HeaderNavLandingClient";
import HeroSliderClient from "@/components/client/pages/HeroSliderLandingPages";

import Footer from "@/components/client/FooterClient";
import RequestQuote from "@/components/demo/RequestQuote";
import LandingPageCommon from "@/components/form/landingpagecommon";

export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/bolden-landing.webp",
    mobile:  "/assets/hero/landing-banner-m.webp",
    title:   "",
    subtitle:"",
    align:   "center",
    overlay: "rgba(0,0,0,0.15)",
    learnMoreHref: "",
    bookHref:      "",
    className:     "landingCommonCst",
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
  