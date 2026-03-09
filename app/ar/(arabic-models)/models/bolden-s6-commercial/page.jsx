// app/models/bolden-s9-off-road/page.jsx
import HeaderNav from "@/components/ar/client/HeaderNavClientAr";
import HeroSliderClient from "@/components/ar/client/models/HeroSliderModels";
import { HERO_SLIDES } from "@/data/ar/models/s6commercial/heroSlides";
import Footer from "@/components/ar/client/FooterClient";


import ProductSectionNav from "@/components/ar/models/ProductSectionNav";

import ColorShowcase from "@/components/ar/models/ColorShowcase"
import colorsVariants from "@/data/ar/models/s6commercial/colors";

import ProductVideoSection from "@/components/models/ProductVideoSection";
import VideoConfig from "@/data/models/s6commercial/videoConfig";

import DualImageIntro from "@/components/models/DualImageIntro";

import ExteriorGallerySwiper from "@/components/ar/models/ExteriorGallerySwiper";
import EXTERIOR_GALLERY_ITEMS from "@/data/ar/models/s6commercial/exteriorGalleryItems";

import ModelFeatureSection from "@/components/ar/models/FeatureSection";
import featureItems from "@/data/ar/models/s6commercial/featureItems";

import InteriorGallerySwiper from "@/components/ar/models/InteriorGallerySwiper";
import INTERIOR_GALLERY_ITEMS from "@/data/ar/models/s6commercial/interiorGalleryItems";

import SpecificationTabs from "@/components/ar/models/SpecsTabs";
import specsTabs from "@/data/ar/models/s6commercial/specsTabs";

import EmiCalculator from "@/components/models/EmiCalculator";
import WarrantyDisclaimerSection from "@/components/ar/models/WarrantyDisclaimerSection";


export default function Page() {
  return (
      <>
        <HeaderNav />

        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />

        <ProductSectionNav modalImage="/assets/popup/s6commercial-popup.webp" />

        {/* <ColorShowcase colors={colorsVariants} initialId="bright-silver" /> */}

        <ProductVideoSection {...VideoConfig} />

        {/* <DualImageIntro /> */}
        <ExteriorGallerySwiper items={EXTERIOR_GALLERY_ITEMS} title="الخارج" />

        {/* <ModelFeatureSection items={featureItems} /> */}

        <InteriorGallerySwiper items={INTERIOR_GALLERY_ITEMS} title="داخلي" />

        <SpecificationTabs title="مواصفات" tabs={specsTabs} defaultKey={specsTabs[0].key} />

        <WarrantyDisclaimerSection
                                  leftImage="/assets/popup/s6commercial-popup.webp"
                                  title="ضمان وخدمات سينوترك بولدن"
                                  description="تحظى سيارات البيك أب التجارية سينوتراك بولدن ببرنامج ملكية متكامل مصمم لدعم الأداء طويل الأمد وتعزيز الاعتمادية التشغيلية في سوق المركبات التجارية في الإمارات. تأتي المركبة بضمان مصنع لمدة 10 سنوات، إضافة إلى باقة صيانة شاملة لمدة 5 سنوات أو 100,000 كيلومتر (أيهما يأتي أولًا)، ما يوفر قيمة تنافسية قوية لرواد الأعمال، وأصحاب الشركات، ومديري أساطيل البيك أب التجارية الباحثين عن الكفاءة وتقليل تكاليف التشغيل."
                                  description2="يساهم هذا البرنامج في تعزيز ثقة العملاء ضمن قطاع سيارات البيك أب للأعمال في الإمارات، من خلال توفير دعم فني وخدمات ما بعد البيع تضمن استمرارية الأداء في مختلف بيئات العمل."
                                  description3="للاطلاع على مزايا الضمان والخدمات، ومعرفة المواصفات والأسعار الخاصة بفئة البيك أب التجارية والعملية في الإمارات، يمكن زيارة صالة العرض المعتمدة أو الدخول إلى الموقع الرسمي mysinotruk.ae للحصول على أحدث المعلومات حول الطرازات والعروض المتاحة وحجز تجربة قيادة."
                                />

        {/* <EmiCalculator /> */}

        
        

        {/* <section id="design"         className="fullvhTest centerTest">Design</section> 
        <section id="exterior"       className="fullvhTest centerTest">exterior</section>
        <section id="interior"       className="fullvhTest centerTest">interior</section>
        <section id="specifications" className="fullvhTest centerTest">specifications</section>*/}

        <Footer />        
      </>
    );
  }
  