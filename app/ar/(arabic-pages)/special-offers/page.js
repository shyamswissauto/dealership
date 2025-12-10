
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/pages/HeroSliderPages";

import Footer from "@/components/client/FooterClient";
import RequestQuote from "@/components/demo/RequestQuote";
import OffersGrid from "@/components/pages/OffersGrid";

export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/offer-page-banner.webp",
    mobile:  "/assets/hero/offer-page-banner-m.webp",
    title:   "Exclusive Offers",
    subtitle:"",
    align:   "left",
    valign:   "end",
    overlay: "rgba(0,0,0,0.5)",
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
        
        <OffersGrid />

        <Footer />        
      </>
    );
  }
  