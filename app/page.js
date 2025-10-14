
import HeaderNav from "@/components/client/HeaderNavClient";
import SmartBuyingTools from "@/components/client/SmartBuyingToolsClient";
import WhoWeAreSection from "@/components/client/WhoWeAreSectionClient";
import FeaturesSection from "@/components/client/FeaturesSectionClient";
import TestDriveSection from "@/components/client/TestDriveSectionClient";
import Footer from "@/components/client/FooterClient";


import HeroSliderClient from "@/components/client/HeroSliderClient";
import ModelsCarouselClient from "@/components/client/ModelsCarouselClient";
import ViewportVideoClient from "@/components/client/ViewportVideoClient";
import GallerySwiperClient from "@/components/client/GallerySwiperClient";


export default function HomePage() {
  return (
    <>
      <HeaderNav />
      <HeroSliderClient />
      <SmartBuyingTools />
      <ModelsCarouselClient />
      {/* <WhoWeAreSection /> */}
      <ViewportVideoClient />
      {/* <FeaturesSection />
      <GallerySwiperClient />
      <TestDriveSection />      */} 
      <Footer />
    </>
  );
}
