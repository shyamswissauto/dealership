
import HeaderNav from "@/components/ar/client/HeaderNavLandingClient";
import HeroSliderClient from "@/components/ar/client/pages/HeroSliderLandingPages";

import Footer from "@/components/ar/client/FooterLandingPageClient";


import LandingPageCommon from "@/components/ar/form/landingpagecommon";
import AtmCards from "@/components/pages/AtmCards";

export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/bolden-landing.webp",
    mobile:  "/assets/hero/bolden-landing-m.webp",
    title:   "",
    subtitle:"",
    align:   "center",
    overlay: "rgba(0,0,0,0.15)",
    learnMoreHref: "",
    bookHref:      "",
    className:     "landingCommonCst",
  },
];

const items = [
    {
      title: "Search Stock",
      copy: "Large stock of new and approved pre-owned vehicles.",
      href: "/stock",
      img: {
        // Replace these with your optimized /public images for best perf
        src: "/assets/hero/bolden-heroslider.webp",
        alt: "Search Stock visual",
      },
      variant: "left-visual",
    },
    {
      title: "Al Tayer Motors Subscription",
      copy: "Subscribe to exclusive luxury drives, curated to your tastes.",
      href: "/subscription/rev",
      img: {
        src: "/assets/hero/bolden-heroslider.webp",
        alt: "REV subscription",
      },
      variant: "default",
    },
    {
      title: "Finance & Insurance",
      copy: "Flexible vehicle Finance & Insurance solutions from Al Tayer Motors.",
      href: "/finance",
      img: {
        src: "/assets/hero/bolden-heroslider.webp",
        alt: "Finance & Insurance icon",
      },
      variant: "circle",
    },
    {
      title: "Our Locations",
      copy: "Find your nearest Al Tayer Motors location.",
      href: "/locations",
      img: {
        src: "/assets/hero/bolden-heroslider.webp",
        alt: "Locations map",
      },
      variant: "default",
    },
  ];


export default function Page() {
  return (
      <>
        <HeaderNav />
        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />
        
        <LandingPageCommon />  
        {/* <AtmCards items={items} /> */}     


        <Footer />        
      </>
    );
  }
  