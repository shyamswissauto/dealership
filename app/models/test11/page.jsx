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
import TechCardsSlider from "@/components/models/TechCardsSlider";
import FeatureQuad from "@/components/sample/FeatureQuad";
import HeroFeature from "@/components/sample/HeroFeature";
import FeatureQuad1 from "@/components/sample/FeatureQuad1";
import GalleryMosaic from "@/components/sample/GalleryMosaic-old";
import GallerySection from "@/components/sample/GallerySection";
import ContractSection from "@/components/sample/ContractSection";


export default function Page() {
  return (
      <>
        <HeaderNav />

        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />

        <ProductSectionNav modalImage="/assets/popup/s9-off-road-popup.webp" />

        <ColorShowcase colors={colorsVariants} initialId="aurora-green" />

        <ProductVideoSection {...VideoConfig} />

        <HeroFeature />

        <TechCardsSlider
          delay={2200}
          speed={900}
          items={[
            {
              image: "/assets/samples/car-garage.jpg",
              heading: "Diesel Power That’s Reliable",
              text: "The Bolden off-road pickup truck is equipped with a Weichai WP2H 2.0T diesel engine, for 140 kW and 420Nm of torque. Paired with Sinotruk’s self-developed 8AT transmission, it gives smooth, reliable performance across rugged terrain and extreme cold.",
            },
            {
              image: "/assets/samples/car-garage.jpg",
              heading: "Quiet Strength & Smart Comfort",
              text: "Inside, the Bolden is equipped with submarine-grade noise reduction tech that keeps cabin sound as low as 39 decibels at idle. Refined materials and intuitive controls balance off-road toughness with passenger comfort.",
            },
            {
              image: "/assets/samples/car-garage.jpg",
              heading: "Built For Tough Handling",
              text: "With a 3230mm wheelbase and rear multi-link solid axle suspension, you are assured of stability and control. 500 tuning schemes and 169 calibration parameters make the chassis precision-engineered for off-roading.",
            },
            {
              image: "/assets/samples/car-garage.jpg",
              heading: "Double Cabin For Full Utility",
              text: "The Bolden’s spacious double-cabin layout seats five comfortably, with a cargo bed measuring 1520×1520×530mm. Whether carrying gear or navigating trails, it’s built for both crew and cargo.",
            },
          ]}
        />

        <FeatureQuad1 /> 

        <GallerySection />    

        <SpecificationTabs title="SPECIFICATIONS" tabs={specsTabs} defaultKey={specsTabs[0].key} />

        <ContractSection image="/assets/models/s9bolden/bolden-s9-hero-slider.webp" />

        {/* <EmiCalculator /> */}

        {/* <GalleryMosaic /> */}

        {/* <DualImageIntro /> */}
        {/* <ExteriorGallerySwiper items={EXTERIOR_GALLERY_ITEMS} title="EXTERIOR" />

        <ModelFeatureSection items={featureItems} />

        <InteriorGallerySwiper items={INTERIOR_GALLERY_ITEMS} title="INTERIOR" /> */}

        {/* <TechCardsSlider
          delay={2200}
          speed={900}
          title = "Interior Features"
          items={[
            {
              image: "/assets/samples/car-garage.jpg",
              heading: "Diesel Power That’s Reliable",
              text: "The Bolden off-road pickup truck is equipped with a Weichai WP2H 2.0T diesel engine, for 140 kW and 420Nm of torque. Paired with Sinotruk’s self-developed 8AT transmission, it gives smooth, reliable performance across rugged terrain and extreme cold.",
            },
            {
              image: "/assets/samples/car-garage.jpg",
              heading: "Quiet Strength & Smart Comfort",
              text: "Inside, the Bolden is equipped with submarine-grade noise reduction tech that keeps cabin sound as low as 39 decibels at idle. Refined materials and intuitive controls balance off-road toughness with passenger comfort.",
            },
            {
              image: "/assets/samples/car-garage.jpg",
              heading: "Built For Tough Handling",
              text: "With a 3230mm wheelbase and rear multi-link solid axle suspension, you are assured of stability and control. 500 tuning schemes and 169 calibration parameters make the chassis precision-engineered for off-roading.",
            },
            {
              image: "/assets/samples/car-garage.jpg",
              heading: "Double Cabin For Full Utility",
              text: "The Bolden’s spacious double-cabin layout seats five comfortably, with a cargo bed measuring 1520×1520×530mm. Whether carrying gear or navigating trails, it’s built for both crew and cargo.",
            },
          ]}
        /> */}

        

        {/* <section id="design"         className="fullvhTest centerTest">Design</section> 
        <section id="exterior"       className="fullvhTest centerTest">exterior</section>
        <section id="interior"       className="fullvhTest centerTest">interior</section>
        <section id="specifications" className="fullvhTest centerTest">specifications</section>*/}

        <Footer />        
      </>
    );
  }
  