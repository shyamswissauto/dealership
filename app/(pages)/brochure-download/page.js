
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/pages/HeroSliderPages";

import Footer from "@/components/client/FooterClient";
import RequestQuote from "@/components/demo/RequestQuote";
import BrochureGrid from "@/components/pages/BrochureGrid";

const BROCHURES = [
  /* {
    title: "U70PRO",
    img: "/assets/models/img5.webp",
    href: "/assets/brochure/sinotruk-u70pro-brochure.pdf",
    download: true,
  },
  {
    title: "U75PLUS",
    img: "/assets/models/img4.webp",
    href: "/assets/brochure/sinotruk-u75plus-brochure.pdf",
    download: true,
  }, */
  {
    title: "BOLDEN S9 OFF-ROAD",
    img: "/assets/models/img2.webp",
    href: "/assets/brochure/bolden-off-road-brochure.pdf",
    download: true,
  },
  {
    title: "BOLDEN S7 PASSENGER",
    img: "/assets/models/img3.webp",
    href: "/assets/brochure/bolden-passenger-brochure.pdf",
    download: true,
  },
  {
    title: "BOLDEN S6 COMMERCIAL",
    img: "/assets/models/img1.webp",
    href: "/assets/brochure/bolden-commercial-brochure.pdf",
    download: true,
  },
];

export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/landing-banner.webp",
    mobile:  "/assets/hero/listing-page-banner.webp",
    title:   "Brochure Download",
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

        <BrochureGrid items={BROCHURES} />


        <Footer />        
      </>
    );
  }
  