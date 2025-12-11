
import HeaderNav from "@/components/ar/client/HeaderNavClientAr";
import HeroSliderClient from "@/components/ar/client/pages/HeroSliderPages";

import Footer from "@/components/ar/client/FooterClient";
import BrochureGrid from "@/components/ar/pages/BrochureGrid";

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
    title: "بولدن أوف رود",
    img: "/assets/models/img2.webp",
    href: "/assets/brochure/bolden-off-road-brochure.pdf",
    download: true,
  },
  {
    title: "بولدن باسنجر",
    img: "/assets/models/img3.webp",
    href: "/assets/brochure/bolden-passenger-brochure.pdf",
    download: true,
  },
  {
    title: "بولدن كوميرشال",
    img: "/assets/models/img1.webp",
    href: "/assets/brochure/bolden-commercial-brochure.pdf",
    download: true,
  },
];

export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/view-brochure.webp",
    mobile:  "/assets/hero/listing-page-banner.webp",
    title:   "تحميل الكتيب",
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
  