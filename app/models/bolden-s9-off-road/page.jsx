// app/models/bolden-s9-off-road/page.jsx
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/models/HeroSliderModels";
import { HERO_SLIDES } from "@/data/heroSlidesS9";
import Footer from "@/components/client/FooterClient";


import ProductSectionNav from "@/components/models/ProductSectionNav";
import ColorShowcase from "@/components/models/ColorShowcase";
import ProductVideoSection from "@/components/models/ProductVideoSection";
import DualImageIntro from "@/components/models/DualImageIntro";
import ExteriorGallerySwiper from "@/components/models/ExteriorGallerySwiper";

export default function Page() {
  return (
      <>
        <HeaderNav />
        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />
        <ProductSectionNav />
        <ColorShowcase />
        <ProductVideoSection />
        {/* <DualImageIntro /> */}
        <ExteriorGallerySwiper />

        
        

        {/* <section id="design"         className="fullvhTest centerTest">Design</section> */}
        <section id="exterior"       className="fullvhTest centerTest">exterior</section>
        <section id="interior"       className="fullvhTest centerTest">interior</section>
        <section id="specifications" className="fullvhTest centerTest">specifications</section>

        Test Page
        <Footer />        
      </>
    );
  }
  