
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/pages/HeroSliderPages";

import Footer from "@/components/client/FooterClient";
import PromoTiles from "@/components/demo/PromoTiles";
import ServicesShowcase from "@/components/demo/ServicesShowcase";


export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/explore-models.webp",
    mobile:  "/assets/hero/listing-page-banner.webp",
    title:   "Brochure Download",
    subtitle:"",
    align:   "left",
    valign:   "end",
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

        <PromoTiles
          items={[
            {
              title: "Maximum Protection,\nMinimum Friction",
              text:
                "Hendrerit tristique torquent laoreet ac quis elementum tempor iaculis hac porta nullam libero.",
              cta: { label: "GET THIS OFFER", href: "/offers/oil-change" },
              img: "/assets/popup/bolden-s9.webp",
            },
            {
              title: "Maximum Protection,\nMinimum Friction",
              text:
                "Hendrerit tristique torquent laoreet ac quis elementum tempor iaculis hac porta nullam libero.",
              cta: { label: "GET THIS OFFER", href: "/offers/oil-change" },
              img: "/assets/popup/bolden-s9.webp",
            },
            {
              title: "Maximum Protection,\nMinimum Friction",
              text:
                "Hendrerit tristique torquent laoreet ac quis elementum tempor iaculis hac porta nullam libero.",
              cta: { label: "GET THIS OFFER", href: "/offers/oil-change" },
              img: "/assets/popup/bolden-s9.webp",
            },
          ]}
        />

        <ServicesShowcase
          bgSrc="/assets/hero/bolden-heroslider.webp"
          bgSrcSm="/assets/hero/passenger-mobile.webp"
          items={[
            { title: "A/C Repair & Services", bullets: ["A/C System", "Heating System", "Cooling System"] },
            { title: "Brakes & Suspensions", bullets: ["Brake Repair", "ABS Repair", "Traction Control"] },
            { title: "Fuel Complaints", bullets: ["Flushes", "Filter Change", "Oil Change"] },
            { title: "Electrical Works", bullets: ["Batteries", "Alternators", "Starters"] },
            { title: "Engine Spare Parts", bullets: ["Engine Light", "Tune-ups", "Replacement"] },
          ]}
          primaryCta={{ label: "VIEW ALL SERVICES", href: "/services" }}
          secondaryCta={{ label: "VIEW PACKAGE", href: "/packages" }}
        />

        

        <Footer />        
      </>
    );
  }
  