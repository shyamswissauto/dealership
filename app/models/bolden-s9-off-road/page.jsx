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
import ContentFaqSection from "@/components/models/s9model/ContentFaqSection";


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

      <ContentFaqSection
        paragraphs={[
          //"The <strong>Sinotruk off-road pickup truck</strong> range, led by the <strong>Chinese car</strong> purpose-built for drivers demanding serious terrain capability across desert, gravel, and uneven landscapes. As a dedicated <strong>Sinotruk Bolden 4x4</strong>, it incorporates reinforced chassis construction and an advanced drivetrain system that defines the <strong>Bolden off-road double cabin pickup specs</strong>. Recognized among competitive <strong>4x4 off-road pickup trucks</strong>, this <strong>Sinotruk Off Road 4x4 pickup</strong> delivers durability and traction personalized to the <strong>off-road pickup truck </strong>environment in the UAE. The integrated <strong>Sinotruk Bolden S9 Off-road features</strong> enhance control, ground clearance, and load-handling performance, positioning it as the best <strong>Sinotruk off-road truck UAE</strong> contender within the expanding Bolden lineup.",
          "The Sinotruk off-road pickup truck range, led by the Chinese car purpose-built for drivers demanding serious terrain capability across desert, gravel, and uneven landscapes. As a dedicated Sinotruk Bolden 4x4, it incorporates reinforced chassis construction and an advanced drivetrain system that defines the Bolden off-road double cabin pickup specs. Recognized among competitive 4x4 off-road pickup trucks, this Sinotruk Off Road 4x4 pickup delivers durability and traction personalized to the off-road pickup truck environment in the UAE. The integrated Sinotruk Bolden S9 Off-road features enhance control, ground clearance, and load-handling performance, positioning it as the best Sinotruk off-road truck UAE contender within the expanding Bolden lineup.",
        ]}
        faqTitle="Frequently Asked Questions"
        faqs={[
          {
            question: "Is the Sinotruk Bolden a good pick-up truck for desert driving in the UAE?",
            answer: "Yes, the Sinotruk Bolden 4&times;4 is designed as a pick-up truck for desert driving in the UAE, offering rugged off-road capability, desert-optimized suspension, and strong traction for dunes and rough terrain.",
          },
          {
            question: "Is the Sinotruk Bolden considered one of the best off-road pick-up vehicles in the UAE?",
            answer: "With its powerful 4&times;4 pick-up car system, off-road modes, and durable chassis, the Bolden stands out as one of the  best off-road pick-up vehicles in the UAE  for drivers who need performance both on highways and in desert environments.",
          },
          {
            question: "What is the towing and load capability of the Sinotruk Bolden for off-road use?",
            answer: "The Bolden offers impressive performance with up to 3 ton towing capacity and around 3,500 kg load capability, making it one of the most practical pick-up cars in Dubai, Abu Dhabi, UAE, for work, adventure, and off-roading in the UAE.",
          },
          {
            question: "Does the Sinotruk Bolden offer comfort and luxury features for off-road driving?",
            answer: "Yes, despite its rugged off-road design, the Bolden also offers premium comfort with leather seats, a luxury cabin, and a 360-degree camera system, combining the strength of a powerful 4WD pickup with modern passenger convenience.",
          },
          {
            question: "Can I add accessories or modify the Sinotruk Bolden for extreme off-roading in the UAE?",
            answer: "Absolutely. The Bolden supports genuine off-road accessories and modification options, allowing owners to customize their vehicle for off-roading in the UAE, from suspension upgrades to additional protective equipment.",
          },
        ]}
      />

      <Footer />
    </>
  );
}
