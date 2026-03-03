// app/models/bolden-s9-off-road/page.jsx
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/models/HeroSliderModels";
import { HERO_SLIDES } from "@/data/models/s7passenger/heroSlides";
import Footer from "@/components/client/FooterClient";


import ProductSectionNav from "@/components/models/ProductSectionNav";

import ColorShowcase from "@/components/models/ColorShowcase"
import colorsVariants from "@/data/models/s7passenger/colors";

import ProductVideoSection from "@/components/models/ProductVideoSection";
import VideoConfig from "@/data/models/s7passenger/videoConfig";

import DualImageIntro from "@/components/models/DualImageIntro";

import ExteriorGallerySwiper from "@/components/models/ExteriorGallerySwiper";
import EXTERIOR_GALLERY_ITEMS from "@/data/models/s7passenger/exteriorGalleryItems";

import ModelFeatureSection from "@/components/models/FeatureSection";
import featureItems from "@/data/models/s7passenger/featureItems";

import InteriorGallerySwiper from "@/components/models/InteriorGallerySwiper";
import INTERIOR_GALLERY_ITEMS from "@/data/models/s7passenger/interiorGalleryItems";

import SpecificationTabs from "@/components/models/SpecsTabs";
import specsTabs from "@/data/models/s7passenger/specsTabs";

import EmiCalculator from "@/components/models/EmiCalculator";
import WarrantyDisclaimerSection from "@/components/models/WarrantyDisclaimerSection";


export default function Page() {
  return (
      <>
        <HeaderNav />

        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />

        <ProductSectionNav modalImage="/assets/popup/s7passenger-popup.webp" />

        <ColorShowcase colors={colorsVariants} initialId="coffee-brown" />

        <ProductVideoSection {...VideoConfig} />

        {/* <DualImageIntro /> */}
        <ExteriorGallerySwiper items={EXTERIOR_GALLERY_ITEMS} title="EXTERIOR" />

        <ModelFeatureSection items={featureItems} />

        <InteriorGallerySwiper items={INTERIOR_GALLERY_ITEMS} title="INTERIOR" />

        <SpecificationTabs title="SPECIFICATIONS" tabs={specsTabs} defaultKey={specsTabs[0].key} />

        {/* <EmiCalculator />
 */}
        
        

        {/* <section id="design"         className="fullvhTest centerTest">Design</section> 
        <section id="exterior"       className="fullvhTest centerTest">exterior</section>
        <section id="interior"       className="fullvhTest centerTest">interior</section>
        <section id="specifications" className="fullvhTest centerTest">specifications</section>*/}

        <WarrantyDisclaimerSection
                  leftImage="/assets/popup/s7passenger-popup.webp"
                  title="Sinotruk Bolden Warranty & Services"
                  description="The Sinotruk Bolden S7 Passenger is designed for confident everyday driving and long-term dependability. It is offered with a 10-year manufacturer warranty, along with an inclusive 5-year or 100,000 km service package, whichever comes first, making it a compelling choice for both personal and professional use in the UAE. It blends robust capability with comfort-focused design for daily commutes, family travel, and extended journeys."
                  description2="Visit Royal Swiss Auto Trading showroom to learn more about the Sinotruk Bolden Passenger, explore warranty and service benefits, and schedule a test drive."
                />

        <Footer />        
      </>
    );
  }
  