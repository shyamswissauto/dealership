
import HeaderNav from "@/components/ar/client/HeaderNavClientAr";
import HeroSliderClient from "@/components/ar/client/pages/HeroSliderPages";

import Footer from "@/components/ar/client/FooterClient";
import OffersGrid from "@/components/ar/pages/OffersGrid";

export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/offer-page-banner.webp",
    mobile:  "/assets/hero/offer-page-banner-m.webp",
    title:   "عروض حصرية",
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
  