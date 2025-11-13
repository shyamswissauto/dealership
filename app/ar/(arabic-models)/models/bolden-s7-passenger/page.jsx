// app/models/bolden-s9-off-road/page.jsx
import HeaderNav from "@/components/ar/client/HeaderNavClientAr";
import HeroSliderClient from "@/components/ar/client/models/HeroSliderModels";
import { HERO_SLIDES } from "@/data/ar/models/s7passenger/heroSlides";
import Footer from "@/components/ar/client/FooterClient";


import ProductSectionNav from "@/components/ar/models/ProductSectionNav";

import ColorShowcase from "@/components/ar/models/ColorShowcase"
import colorsVariants from "@/data/ar/models/s7passenger/colors";

import ProductVideoSection from "@/components/models/ProductVideoSection";
import VideoConfig from "@/data/models/s7passenger/videoConfig";

import DualImageIntro from "@/components/models/DualImageIntro";

import ExteriorGallerySwiper from "@/components/ar/models/ExteriorGallerySwiper";
import EXTERIOR_GALLERY_ITEMS from "@/data/ar/models/s7passenger/exteriorGalleryItems";

import ModelFeatureSection from "@/components/ar/models/FeatureSection";
import featureItems from "@/data/ar/models/s7passenger/featureItems";

import InteriorGallerySwiper from "@/components/ar/models/InteriorGallerySwiper";
import INTERIOR_GALLERY_ITEMS from "@/data/ar/models/s7passenger/interiorGalleryItems";

import SpecificationTabs from "@/components/ar/models/SpecsTabs";
import specsTabs from "@/data/ar/models/s7passenger/specsTabs";

import EmiCalculator from "@/components/models/EmiCalculator";


export default function Page() {
  return (
      <>
        <HeaderNav />

        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />

        <ProductSectionNav modalImage="/assets/popup/s7passenger-popup.webp" />

        <ColorShowcase colors={colorsVariants} initialId="coffee-brown" />

        <ProductVideoSection {...VideoConfig} />

        {/* <DualImageIntro /> */}
        <ExteriorGallerySwiper items={EXTERIOR_GALLERY_ITEMS} title="الخارج" />

        <ModelFeatureSection items={featureItems} />

        <InteriorGallerySwiper items={INTERIOR_GALLERY_ITEMS} title="داخلي" />

        <SpecificationTabs title="مواصفات" tabs={specsTabs} defaultKey={specsTabs[0].key} />

        {/* <EmiCalculator />
 */}
        
        

        {/* <section id="design"         className="fullvhTest centerTest">Design</section> 
        <section id="exterior"       className="fullvhTest centerTest">exterior</section>
        <section id="interior"       className="fullvhTest centerTest">interior</section>
        <section id="specifications" className="fullvhTest centerTest">specifications</section>*/}

        <Footer />        
      </>
    );
  }
  