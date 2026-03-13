// app/models/page.jsx
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/models/HeroSliderModels";
import { HERO_SLIDES } from "@/data/models/all-list/heroSlides";
import Footer from "@/components/client/FooterClient";
import ShowcaseHero from "@/components/modelList/ShowcaseHero";
import { SHOWCASE_DEFAULT, SHOWCASE_PRESETS } from "@/data/models/all-list/showcasePresets";
import PromoGrid from "@/components/modelList/PromoGrid";
import ModelsSeoSection from "@/components/modelList/ModelsSeoSection";
import VehicleColorSwitcher from "@/components/modelList/VehicleColorSwitcher";
import InteriorLoopSlider from "@/components/modelList/InteriorLoopSlider";




export default function Page() {
  return (
    <>
      <HeaderNav />
      <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />
      {/* <ShowcaseHero /> */}
      {/* <ShowcaseHero {...SHOWCASE_DEFAULT} />
        <ShowcaseHero {...SHOWCASE_PRESETS.u75plus} subtitle="Conquer any terrain." /> */}
      <PromoGrid />

      <ModelsSeoSection />

      {/* <VehicleColorSwitcher /> */}

      {/* <InteriorLoopSlider
        sectionTitle="Interior Gallery"
        sectionText="Explore premium details, materials, and cabin design."
        slides={[
          {
            image: "/assets/interior-slider/slide-1.jpg",
            title: "HELLO MARVEL!",
            description:
              "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore",
          },
          {
            image: "/assets/interior-slider/slide-2.jpg",
            title: "HELLO MARVEL!",
            description:
              "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore",
          },
          {
            image: "/assets/interior-slider/slide-3.jpg",
            title: "HELLO MARVEL!",
            description:
              "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore",
          },
          {
            image: "/assets/interior-slider/slide-4.jpg",
            title: "HELLO MARVEL!",
            description:
              "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore",
          },
        ]}
      /> */}


      <Footer />
    </>
  );
}
