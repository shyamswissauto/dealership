
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/pages/HeroSliderPages";

import Footer from "@/components/client/FooterClient";
import RequestQuote from "@/components/demo/RequestQuote";
import ExperienceSection from "@/components/pages/ExperienceSection";
import TrackExperienceHero from "@/components/pages/TrackExperienceHero";
import MoreInfoSection from "@/components/pages/MoreInfoSection";

export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/experience-the-drive.webp",
    mobile:  "/assets/hero/listing-page-banner.webp",
    title:   "STEP IN, START UP, AND EXPERIENCE THE DIFFERENCE.",
    subtitle:"",
    align:   "left",
    valign:   "end",
    overlay: "rgba(0,0,0,0.6)",
    learnMoreHref: "",
    bookHref:      "",
    className:     "experienceHero",
  },
];


export default function Page() {
  return (
      <>
        <HeaderNav />
        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />

        <ExperienceSection />

        <TrackExperienceHero />

        <MoreInfoSection />
         


        <Footer />        
      </>
    );
  }
  