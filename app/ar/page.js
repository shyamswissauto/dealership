
import HeaderNav from "@/components/ar/client/HeaderNavClientAr";
import HeroSliderClient from "@/components/ar/client/HeroSliderClient";
import SmartBuyingTools from "@/components/ar/client/SmartBuyingToolsClient";
import ModelsCarouselClient from "@/components/ar/client/ModelsCarouselClient";
import WhoWeAreSection from "@/components/ar/client/WhoWeAreSectionClient";
import ViewportVideoClient from "@/components/ar/client/ViewportVideoClient";
import FeaturesSection from "@/components/ar/client/FeaturesSectionClient";
import TestDriveSection from "@/components/ar/client/TestDriveSectionClient";
import Footer from "@/components/ar/client/FooterClient";


export default function ArabicHome() {
  return (
    <>
      <HeaderNav />
      <HeroSliderClient />
      <SmartBuyingTools />
      <ModelsCarouselClient />
      <WhoWeAreSection />
      <ViewportVideoClient />
      <FeaturesSection />
      {/* <GallerySwiperClient /> */}
      <TestDriveSection />
      <Footer />
    </>
  );
}
