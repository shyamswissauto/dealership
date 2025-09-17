// app/models/page.jsx
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/models/HeroSliderModels";
import { HERO_SLIDES } from "@/data/models/all-list/heroSlides";
import Footer from "@/components/client/FooterClient";
import ShowcaseHero from "@/components/modelList/ShowcaseHero";




export default function Page() {
  return (
      <>
        <HeaderNav />
        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />
        <ShowcaseHero />




        <Footer />        
      </>
    );
  }
  