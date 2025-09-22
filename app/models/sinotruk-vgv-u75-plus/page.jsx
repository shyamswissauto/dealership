
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/models/HeroSliderModels";
import { HERO_SLIDES } from "@/data/models/u75plus/heroSlides";
import Footer from "@/components/client/FooterClient";


import ProductSectionNav from "@/components/models/ProductSectionNav";

import ColorShowcase from "@/components/models/ColorShowcase"
import colorsVariants from "@/data/models/u75plus/colors";

import ProductVideoSection from "@/components/models/ProductVideoSection";
import VideoConfig from "@/data/models/u75plus/videoConfig";

import DualImageIntro from "@/components/models/DualImageIntro";

import ExteriorGallerySwiper from "@/components/models/ExteriorGallerySwiper";
import EXTERIOR_GALLERY_ITEMS from "@/data/models/u75plus/exteriorGalleryItems";

import ModelFeatureSection from "@/components/models/FeatureSection";
import featureItems from "@/data/models/u75plus/featureItems";

import InteriorGallerySwiper from "@/components/models/InteriorGallerySwiper";
import INTERIOR_GALLERY_ITEMS from "@/data/models/u75plus/interiorGalleryItems";

import SpecificationTabs from "@/components/models/SpecsTabs";
import specsTabs from "@/data/models/u75plus/specsTabs";

import EmiCalculator from "@/components/models/EmiCalculator";


export default function Page() {
  return (
      <>
        <HeaderNav />

        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />

        <ProductSectionNav modalImage="/assets/popup/u75plus-popup.webp" />

        <ColorShowcase colors={colorsVariants} initialId="bright-silver" />

        <ProductVideoSection {...VideoConfig} />

        {/* <DualImageIntro /> */}
        <ExteriorGallerySwiper items={EXTERIOR_GALLERY_ITEMS} title="EXTERIOR" />

        <ModelFeatureSection items={featureItems} />

        <InteriorGallerySwiper items={INTERIOR_GALLERY_ITEMS} title="INTERIOR" />

        <SpecificationTabs title="SPECIFICATIONS" tabs={specsTabs} defaultKey={specsTabs[0].key} />

        <EmiCalculator />

        
        

        {/* <section id="design"         className="fullvhTest centerTest">Design</section> 
        <section id="exterior"       className="fullvhTest centerTest">exterior</section>
        <section id="interior"       className="fullvhTest centerTest">interior</section>
        <section id="specifications" className="fullvhTest centerTest">specifications</section>*/}

        <Footer />        
      </>
    );
  }
  