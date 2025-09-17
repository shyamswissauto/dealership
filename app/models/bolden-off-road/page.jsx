// app/models/bolden-s9-off-road/page.jsx
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/models/HeroSliderModels";
import { HERO_SLIDES } from "@/data/heroSlidesS9";
import Footer from "@/components/client/FooterClient";


import ProductSectionNav from "@/components/models/ProductSectionNav";
import ColorShowcase from "@/components/models/ColorShowcase";
import ProductVideoSection from "@/components/models/ProductVideoSection";
import DualImageIntro from "@/components/models/DualImageIntro";
import ExteriorGallerySwiper from "@/components/models/ExteriorGallerySwiper";
import ModelFeatureSection from "@/components/models/FeatureSection";
import InteriorGallerySwiper from "@/components/models/InteriorGallerySwiper";
import SpecsTabs from "@/components/models/SpecsTabs";
import EmiCalculator from "@/components/models/EmiCalculator";


export default function Page() {
  return (
      <>
        <HeaderNav />
        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />
        <ProductSectionNav />
        <ColorShowcase />
        <ProductVideoSection />
        {/* <DualImageIntro /> */}
        <ExteriorGallerySwiper />
        <ModelFeatureSection />
        <InteriorGallerySwiper />
        <SpecsTabs />
        <EmiCalculator />

        
        

        {/* <section id="design"         className="fullvhTest centerTest">Design</section> 
        <section id="exterior"       className="fullvhTest centerTest">exterior</section>
        <section id="interior"       className="fullvhTest centerTest">interior</section>
        <section id="specifications" className="fullvhTest centerTest">specifications</section>*/}

        <Footer />        
      </>
    );
  }
  