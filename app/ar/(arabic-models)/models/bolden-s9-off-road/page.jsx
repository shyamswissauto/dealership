// app/models/bolden-s9-off-road/page.jsx
import HeaderNav from "@/components/ar/client/HeaderNavClientAr";
import HeroSliderClient from "@/components/ar/client/models/HeroSliderModels";
import { HERO_SLIDES } from "@/data/ar/models/s9offroad/heroSlides";

import ProductSectionNav from "@/components/ar/models/ProductSectionNav";

import ColorShowcase from "@/components/ar/models/ColorShowcase"
import colorsVariants from "@/data/ar/models/s9offroad/colors";

import ProductVideoSection from "@/components/models/ProductVideoSection";
import VideoConfig from "@/data/models/s9offroad/videoConfig";


import ExteriorGallerySwiper from "@/components/ar/models/ExteriorGallerySwiper";
import EXTERIOR_GALLERY_ITEMS from "@/data/ar/models/s9offroad/exteriorGalleryItems";

import ModelFeatureSection from "@/components/ar/models/FeatureSection";
import featureItems from "@/data/ar/models/s9offroad/featureItems";

import InteriorGallerySwiper from "@/components/ar/models/InteriorGallerySwiper";
import INTERIOR_GALLERY_ITEMS from "@/data/ar/models/s9offroad/interiorGalleryItems";

import SpecificationTabs from "@/components/ar/models/SpecsTabs";
import specsTabs from "@/data/ar/models/s9offroad/specsTabs";

import EmiCalculator from "@/components/models/EmiCalculator";
import Footer from "@/components/ar/client/FooterClient";
import WarrantyDisclaimerSection from "@/components/ar/models/WarrantyDisclaimerSection";

export default function Page() {
  return (
      <>
        <HeaderNav />

        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />

        <ProductSectionNav modalImage="/assets/popup/s9-off-road-popup.webp" />

        <ColorShowcase colors={colorsVariants} initialId="aurora-green" />

        <ProductVideoSection {...VideoConfig} />

        {/* <DualImageIntro /> */}
        <ExteriorGallerySwiper items={EXTERIOR_GALLERY_ITEMS} title="الخارج" />

        <ModelFeatureSection items={featureItems} />

        <InteriorGallerySwiper items={INTERIOR_GALLERY_ITEMS} title="داخلي" />

        <SpecificationTabs title="مواصفات" tabs={specsTabs} defaultKey={specsTabs[0].key} />

        <WarrantyDisclaimerSection
                  leftImage="/assets/popup/s9-off-road-popup.webp"
                  title="ضمان وخدمات سينوترك بولدن"
                  description="تأتي سيارة سينوتراك بولدن S9 للطرق الوعرة بضمان مصنع لمدة 10 سنوات، إضافة إلى باقة صيانة شاملة لمدة 5 سنوات أو 100,000 كيلومتر، أيهما يأتي أولاً، مما يجعلها خيارًا قويًا للسائقين الذين يبحثون عن المتانة والقدرة والقيمة طويلة الأمد في دولة الإمارات العربية المتحدة. يجمع طراز Bolden S9 بين قدرات 4x4 القوية على الطرق الوعرة وراحة متطورة وميزات عملية متعددة داخل الإمارات."
                  description2="قم بزيارة صالة عرض رويال سويس اوتو تريدينج لمعرفة المزيد حول سينوتراك بولدن S9 Off-Road للطرق الوعرة ، واستكشاف مزايا الضمان والخدمات، وحجز تجربة قيادة، أو زيارة الموقع الرسمي mysinotruk.ae للحصول على التفاصيل الكاملة."
                  description3="تأتي سيارة سينوتراك بولدن S9 للطرق الوعرة بضمان مصنع لمدة 10 سنوات، إضافة إلى باقة صيانة شاملة لمدة 5 سنوات أو 100,000 كيلومتر (أيهما يأتي أولاً)، ما يجعلها خيارًا مثاليًا ضمن فئة بيك أب ديزل 4x4 في الإمارات للسائقين الباحثين عن المتانة العالية، والأداء القوي في الظروف الصحراوية، وقيمة ملكية طويلة الأمد."
                  description4="يجمع طراز Bolden S9 بين قدرات الدفع الرباعي 4x4 المتقدمة على الطرق الوعرة لتناسب القيادة في الصحراء والبيئات القاسية، ومستوى راحة متطور للاستخدام اليومي، إلى جانب تجهيزات عملية تلائم احتياجات العمل والمغامرات، مما يجعله منافسًا قويًا في سوق سيارات البيك أب 4x4 متعددة الاستخدامات في الإمارات."
                  description5="للمزيد من التفاصيل حول المواصفات، خيارات الضمان والصيانة، وأسعار سيارات البيك أب التجارية والطرق الوعرة في الإمارات، يمكنكم زيارة صالة العرض المعتمدة أو الدخول إلى الموقع الرسمي mysinotruk.ae للاطلاع على المعلومات الكاملة وحجز تجربة قيادة."
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
  