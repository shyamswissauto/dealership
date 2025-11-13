
import HeaderNav from "@/components/ar/client/HeaderNavClientAr";
import HeroSliderClient from "@/components/ar/client/pages/HeroSliderPages";

import Footer from "@/components/ar/client/FooterClient";
import RequestQuote from "@/components/demo/RequestQuote";
import ExperienceSection from "@/components/ar/pages/ExperienceSection";
import TrackExperienceHero from "@/components/ar/pages/TrackExperienceHero";
import MoreInfoSection from "@/components/ar/pages/MoreInfoSection";


export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/experience-the-drive.webp",
    mobile:  "/assets/hero/listing-page-banner.webp",
    title:   "ادخل، ابدأ، واختبر الفرق.",
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
  