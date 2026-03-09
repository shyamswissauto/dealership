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
import WarrantyDisclaimerSection from "@/components/ar/models/WarrantyDisclaimerSection";


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

        <WarrantyDisclaimerSection
                          leftImage="/assets/popup/s7passenger-popup.webp"
                          title="ضمان وخدمات سينوترك بولدن"
                          description="تم تصميم طراز الركاب سينوتراك بولدن S7 ليواكب احتياجات القيادة اليومية بثقة واعتمادية طويلة الأمد في سوق سيارات البيك أب في الإمارات. يأتي هذا الطراز مع ضمان مصنع لمدة 10 سنوات، إضافة إلى باقة صيانة شاملة لمدة 5 سنوات أو 100,000 كيلومتر (أيهما يأتي أولًا)، ما يجعله خيارًا تنافسيًا ضمن فئة بيك أب عائلية متعددة الاستخدامات المناسبة للاستخدام الشخصي والمهني."
                          description2="يجمع الطراز بين قوة الأداء في فئة ديزل بيك أب 4x4 والتصميم الداخلي المريح الذي يلائم التنقل اليومي، والسفر العائلي، والرحلات الطويلة داخل المدن وعلى الطرق السريعة وفي البيئات الصحراوية. كما يوفر توازنًا بين القدرة العملية والمتانة، ليخدم احتياجات الأفراد ورواد الأعمال الباحثين عن سيارة بيك أب عملية واقتصادية في الإمارات."
                          description3="للمزيد من المعلومات حول المواصفات، الأسعار، وخيارات الضمان والصيانة لسيارات البيك أب التجارية والركاب، يمكنكم زيارة صالة عرض رويال سويس أوتو تريدنج أو الدخول إلى الموقع الرسمي mysinotruk.ae للاطلاع على التفاصيل الكاملة وحجز تجربة قيادة."
                        />

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
  