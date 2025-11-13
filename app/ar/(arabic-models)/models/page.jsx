// app/models/page.jsx
import HeaderNav from "@/components/ar/client/HeaderNavClientAr";
import HeroSliderClient from "@/components/ar/client/models/HeroSliderModels";
import { HERO_SLIDES } from "@/data/ar/models/all-list/heroSlides";
import Footer from "@/components/ar/client/FooterClient";
import ShowcaseHero from "@/components/modelList/ShowcaseHero";
import { SHOWCASE_DEFAULT, SHOWCASE_PRESETS } from "@/data/models/all-list/showcasePresets";
import PromoGrid from "@/components/ar/modelList/PromoGrid";




export default function Page() {
  return (
      <>
        <HeaderNav />
        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />
        {/* <ShowcaseHero /> */}
        {/* <ShowcaseHero {...SHOWCASE_DEFAULT} />
        <ShowcaseHero {...SHOWCASE_PRESETS.u75plus} subtitle="Conquer any terrain." /> */}
        <PromoGrid />




        <Footer />        
      </>
    );
  }
  