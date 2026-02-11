
import HeaderNav from "@/components/client/HeaderNavLandingClient";
import HeroSliderClient from "@/components/client/pages/HeroSliderLandingPages";

import Footer from "@/components/client/FooterLandingPageClient";
import RequestQuote from "@/components/demo/RequestQuote";
import LandingPageCommon from "@/components/form/landingpagecommon";

export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/ramadan/ramadan-kareem-bolden-landing.webp", //desktop: "/assets/hero/bolden-landing.webp",
    mobile:  "/assets/hero/ramadan/ramadan-kareem-bolden-landing-mobile.webp", //    /assets/hero/bolden-landing-m.webp
    title:   "",
    subtitle:"",
    align:   "center",
    overlay: "rgba(0,0,0,0.05)",
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
  