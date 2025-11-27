
import HeaderNav from "@/components/client/HeaderNavLandingClient";
import HeroSliderClient from "@/components/client/pages/HeroSliderLandingPages";

import Footer from "@/components/client/FooterLandingPageClient";
import RequestQuote from "@/components/demo/RequestQuote";
import LandingPageCommon from "@/components/form/landingpagecommon";

export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/uae/bolden-landing.webp", //     /assets/hero/bolden-landing.webp
    mobile:  "/assets/hero/uae/bolden-landing-m.webp", //    /assets/hero/bolden-landing-m.webp
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
  