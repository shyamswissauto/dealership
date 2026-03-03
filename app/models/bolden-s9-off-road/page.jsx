// app/models/bolden-s9-off-road/page.jsx
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/models/HeroSliderModels";
import { HERO_SLIDES } from "@/data/models/s9offroad/heroSlides";
import Footer from "@/components/client/FooterClient";


import ProductSectionNav from "@/components/models/ProductSectionNav";

import ColorShowcase from "@/components/models/ColorShowcase"
import colorsVariants from "@/data/models/s9offroad/colors";

import ProductVideoSection from "@/components/models/ProductVideoSection";
import VideoConfig from "@/data/models/s9offroad/videoConfig";

import DualImageIntro from "@/components/models/DualImageIntro";

import ExteriorGallerySwiper from "@/components/models/ExteriorGallerySwiper";
import EXTERIOR_GALLERY_ITEMS from "@/data/models/s9offroad/exteriorGalleryItems";

import ModelFeatureSection from "@/components/models/FeatureSection";
import featureItems from "@/data/models/s9offroad/featureItems";

import InteriorGallerySwiper from "@/components/models/InteriorGallerySwiper";
import INTERIOR_GALLERY_ITEMS from "@/data/models/s9offroad/interiorGalleryItems";

import SpecificationTabs from "@/components/models/SpecsTabs";
import specsTabs from "@/data/models/s9offroad/specsTabs";

import EmiCalculator from "@/components/models/EmiCalculator";
import WarrantyDisclaimerSection from "@/components/models/WarrantyDisclaimerSection";


export default function Page() {
  return (
      <>
        <HeaderNav />

        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />

        <ProductSectionNav modalImage="/assets/popup/s9-off-road-popup.webp" />

        <ColorShowcase colors={colorsVariants} initialId="aurora-green" />

        <ProductVideoSection {...VideoConfig} />

        {/* <DualImageIntro /> */}
        <ExteriorGallerySwiper items={EXTERIOR_GALLERY_ITEMS} title="EXTERIOR" />

        <ModelFeatureSection items={featureItems} />

        <InteriorGallerySwiper items={INTERIOR_GALLERY_ITEMS} title="INTERIOR" />

        <SpecificationTabs title="SPECIFICATIONS" tabs={specsTabs} defaultKey={specsTabs[0].key} />

        {/* <EmiCalculator /> */}
        {/* <section id="design"         className="fullvhTest centerTest">Design</section> 
        <section id="exterior"       className="fullvhTest centerTest">exterior</section>
        <section id="interior"       className="fullvhTest centerTest">interior</section>
        <section id="specifications" className="fullvhTest centerTest">specifications</section>*/}

        <WarrantyDisclaimerSection
          leftImage="/assets/popup/s9-off-road-popup.webp"
          title="Sinotruk Bolden Warranty & Services"
          description="The Sinotruk Bolden S9 Off-Road comes with a 10-year manufacturer warranty and an inclusive 5-year or 100,000 km service package, whichever comes first, making it a strong choice for drivers who demand durability, capability, and long-term value in the UAE. Bolden S9 combines powerful off-road capability with refined comfort and practical utility features across the UAE."
          description2="Visit Royal Swiss Auto showroom to learn more about the Sinotruk Bolden Off-Road, explore warranty and service benefits, and schedule a test drive."
        />

        <Footer />        
      </>
    );
  }
  