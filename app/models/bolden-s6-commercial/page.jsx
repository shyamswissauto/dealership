// app/models/bolden-s9-off-road/page.jsx
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/models/HeroSliderModels";
import { HERO_SLIDES } from "@/data/models/s6commercial/heroSlides";
import Footer from "@/components/client/FooterClient";


import ProductSectionNav from "@/components/models/ProductSectionNav";

import ColorShowcase from "@/components/models/ColorShowcase"
import colorsVariants from "@/data/models/s6commercial/colors";

import ProductVideoSection from "@/components/models/ProductVideoSection";
import VideoConfig from "@/data/models/s6commercial/videoConfig";

import DualImageIntro from "@/components/models/DualImageIntro";

import ExteriorGallerySwiper from "@/components/models/ExteriorGallerySwiper";
import EXTERIOR_GALLERY_ITEMS from "@/data/models/s6commercial/exteriorGalleryItems";

import ModelFeatureSection from "@/components/models/FeatureSection";
import featureItems from "@/data/models/s6commercial/featureItems";

import InteriorGallerySwiper from "@/components/models/InteriorGallerySwiper";
import INTERIOR_GALLERY_ITEMS from "@/data/models/s6commercial/interiorGalleryItems";

import SpecificationTabs from "@/components/models/SpecsTabs";
import specsTabs from "@/data/models/s6commercial/specsTabs";

import EmiCalculator from "@/components/models/EmiCalculator";
import WarrantyDisclaimerSection from "@/components/models/WarrantyDisclaimerSection";
import ContentFaqSection from "@/components/models/s9model/ContentFaqSection";


export default function Page() {
  return (
      <>
        <HeaderNav />

        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />

        <ProductSectionNav modalImage="/assets/popup/s6commercial-popup.webp" />

        {/* <ColorShowcase colors={colorsVariants} initialId="bright-silver" /> */}

        <ProductVideoSection {...VideoConfig} />

        {/* <DualImageIntro /> */}
        <ExteriorGallerySwiper items={EXTERIOR_GALLERY_ITEMS} title="EXTERIOR" />

        {/* <ModelFeatureSection items={featureItems} /> */}

        <InteriorGallerySwiper items={INTERIOR_GALLERY_ITEMS} title="INTERIOR" />

        <SpecificationTabs title="SPECIFICATIONS" tabs={specsTabs} defaultKey={specsTabs[0].key} />

        {/* <EmiCalculator /> */}

        
        

        {/* <section id="design"         className="fullvhTest centerTest">Design</section> 
        <section id="exterior"       className="fullvhTest centerTest">exterior</section>
        <section id="interior"       className="fullvhTest centerTest">interior</section>
        <section id="specifications" className="fullvhTest centerTest">specifications</section>*/}

        <WarrantyDisclaimerSection
                          leftImage="/assets/popup/s6commercial-popup.webp"
                          title="Sinotruk Bolden Warranty & Services"
                          description="The Sinotruk Bolden Commercial is backed by a detailed ownership program designed to support long-term performance and operational reliability. The vehicle comes with a 10-year manufacturer warranty, along with an inclusive 5-year or 100,000 km service package, whichever comes first, offering strong value for commercial operators and fleet customers across the UAE."
                          description2="Visit Royal Swiss Auto Trading showroom to learn more about the Sinotruk Bolden Commercial, explore warranty and service benefits, and schedule a test drive."
                        />

        <ContentFaqSection
                paragraphs={[
                  "The Sinotruk Bolden S6 Commercial variant is developed as a purpose-built commercial 1-ton pickup for the business in the UAE, engineered to support demanding operational cycles across logistics and service industries. Available in both double-cabin 4x2 pickup truck UAE and double-cabin 4x4 pickup UAE configurations, it provides flexibility for companies requiring scalable utility. As a capable Sinotruk Bolden 4x4 commercial pickup, it integrates a reinforced ladder-frame chassis and torque-focused diesel powertrain, making it a dependable diesel 4x4 pickup for company use. Businesses operating in major hubs such as 1 ton pickup truck Dubai and 1 ton pickup truck Abu Dhabi markets benefit from its payload efficiency and adaptable drivetrain options, including manual pickup UAE and automatic pickup UAE variants.",
                  "Built to perform in high-demand environments, this heavy-duty 1-ton pickup UAE solution is well-suited for infrastructure, contracting, and industrial deployment. As a Chinese Car, it functions effectively as a construction 4x4 pickup truck in the UAE, while its cabin layout supports crew mobility as a worksite double-cabin pickup in the UAE. Fleet operators can position it as a reliable fleet 4x4 pickup UAE asset, and its optimized bed capacity ensures strong performance as a cargo 1-ton pickup truck UAE. Overall, the double-cabin pickup UAE configuration delivers the durability, load capability, and operational consistency required for structured commercial applications.",
                ]}
                faqTitle="Frequently Asked Questions"
                faqs={[
                  {
                    question: "Does the Sinotruk Bolden Commercial come with transmission options?",
                    answer: "Yes. The Sinotruk Bolden Commercial pickup truck is available with a 4&times;2 manual transmission, which is ideal for efficient daily cargo transport. It also offers a 4&times;4 automatic transmission variant designed for better driving on rough roads, as it is a versatile commercial pickup truck and Chinese pickup truck in the UAE, suitable for both city logistics and demanding work environments.",
                  },
                  {
                    question: "How durable is the Sinotruk Bolden for commercial work in the UAE?",
                    answer: "The Sinotruk Bolden Commercial is engineered with a strong chassis and reliable drivetrain, allowing it to handle demanding business operations. It supports up to a 1-ton payload capacity and around 3-ton towing power, making it suitable for heavy-duty tasks.",
                  },
                  {
                    question: "Is the Sinotruk Bolden a good pickup truck in the UAE for business operations?",
                    answer: "Yes, many companies choose the Sinotruk Bolden Commercial as a dependable best pickup truck in UAE for its strong chassis, practical cargo capacity, and efficient performance.",
                  },
                  {
                    question: "Is the Sinotruk Bolden considered a reliable Chinese pickup truck?",
                    answer: "Yes, the Sinotruk Bolden is Top Chinese pickup truck in UAE designed with durable engineering and practical features, making it suitable for demanding commercial applications.",
                  },
                  {
                    question: "I&rsquo;m looking for the best commercial double cabin pickup in the UAE. Is the Sinotruk Bolden a good option?",
                    answer: "Yes, the Sinotruk Bolden Commercial is a practical best commercial double cabin pickup in the UAE, offering comfortable seating for work crews along with strong cargo capability, especially for work sites.",
                  },
                ]}
              />

        <Footer />        
      </>
    );
  }
  