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
import ContentFaqSection from "@/components/models/s9model/ContentFaqSection";


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

        <ContentFaqSection
                paragraphs={[
                  "The Sinotruk Bolden S7 passenger variant is engineered for refined everyday mobility while maintaining the rugged DNA expected from a modern pickup. Positioned as a competitive Bolden passenger pickup UAE option, it blends comfort-oriented cabin ergonomics with dependable mechanical architecture suited for urban and intercity use. The Sinotruk Bolden S7 passenger 4x4 pickup truck UAE configuration enhances stability and traction, making it a practical Sinotruk passenger pickup UAE solution for families and professionals alike. With well-calibrated Sinotruk Bolden S7 passenger specs and thoughtfully integrated Sinotruk Bolden passenger features, this Chinese Car model stands out for balancing drivability, utility, and structural strength in the evolving pickup segment.",
                ]}
                faqTitle="Frequently Asked Questions"
                faqs={[
                  {
                    question: "Is the Bolden S7 passenger pickup truck suitable for desert and sand driving in the UAE?",
                    answer: "Yes, the Bolden S7 passenger pickup truck is built for GCC conditions with strong traction and stability. Its diesel engine and high torque help it perform confidently on desert roads and sandy terrain.",
                  },
                  {
                    question: "Is the Sinotruk Bolden S7 a reliable diesel passenger pickup in the UAE?",
                    answer: "Yes, the Sinotruk Bolden S7 Passenger is a dependable diesel passenger pickup UAE option, combining a durable drivetrain, efficient diesel performance, and strong pickup cargo capability for daily use.",
                  },
                  {
                    question: "Can the Bolden S7 be used as a family pickup truck in the UAE?",
                    answer: "Absolutely. The Bolden S7 Passenger works well as a family pickup truck UAE, offering a spacious cabin, comfortable seating, and a luxury interior passenger pickup design suitable for both travel and everyday driving.",
                  },
                  {
                    question: "What makes the Sinotruk Bolden S7 one of the powerful pickup trucks in the UAE?",
                    answer: "The Sinotruk pickup truck UAE lineup includes the Bolden S7, which delivers strong performance with a diesel engine and high torque making it a powerful pickup truck UAE for both work and passenger use.",
                  },
                  {
                    question: "Is the Sinotruk Bolden S7 considered one of the best passenger pickup trucks in the UAE?",
                    answer: "Yes, the Sinotruk Bolden S7 Passenger stands out as one of the best passenger pickup trucks in UAE, combining comfort, durability, and pickup cargo capability in a GCC pickup truck designed for regional driving conditions.",
                  },
                ]}
              />

        <Footer />        
      </>
    );
  }
  