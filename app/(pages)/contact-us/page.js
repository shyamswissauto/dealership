
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/pages/HeroSliderPages";

import Footer from "@/components/client/FooterClient";
import RequestQuote from "@/components/demo/RequestQuote";

export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/explore-models.webp",
    mobile:  "/assets/hero/listing-page-banner.webp",
    title:   "REQUEST A QUOTE",
    subtitle:"",
    align:   "center",
    overlay: "rgba(0,0,0,0.3)",
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
        <RequestQuote />        


        <Footer />        
      </>
    );
  }
  