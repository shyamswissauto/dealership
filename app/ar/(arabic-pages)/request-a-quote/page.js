
import HeaderNav from "@/components/ar/client/HeaderNavClientAr";
import HeroSliderClient from "@/components/ar/client/pages/HeroSliderPages";

import Footer from "@/components/ar/client/FooterClient";
import RequestQuote from "@/components/ar/demo/RequestQuote";

export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/request-a-quote.webp",
    mobile:  "/assets/hero/listing-page-banner.webp",
    title:   "اطلب عرض الأسعار",
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
        <RequestQuote />        


        <Footer />        
      </>
    );
  }
  