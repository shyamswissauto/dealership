// app/models/page.jsx
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/pages/HeroSliderPages";
import { HERO_SLIDES } from "@/data/models/all-list/heroSlides";
import Footer from "@/components/client/FooterClient";
import RequestQuote from "@/components/demo/RequestQuote";
import DualImageIntro from "@/components/models/DualImageIntro";
import LateralScrollSection from "@/components/demo/LateralScrollSection";
import PerformanceVideoSection from "@/components/demo/PerformanceVideoSection";
import ShowcaseHero from "@/components/demo/ShowcaseHero";




export default function Page() {
  return (
      <>
        <HeaderNav />
        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />
        <RequestQuote />
        <ShowcaseHero />
        



        <Footer />        
      </>
    );
  }
  