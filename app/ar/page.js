
import HeaderNav from "@/components/ar/client/HeaderNavClientAr";
import HeroSliderClient from "@/components/ar/client/HeroSliderClient";
import SmartBuyingTools from "@/components/client/SmartBuyingToolsClient";
import ModelsCarouselClient from "@/components/client/ModelsCarouselClient";
import WhoWeAreSection from "@/components/client/WhoWeAreSectionClient";
import ViewportVideoClient from "@/components/client/ViewportVideoClient";
import FeaturesSection from "@/components/client/FeaturesSectionClient";
import TestDriveSection from "@/components/client/TestDriveSectionClient";
import Footer from "@/components/client/FooterClient";


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
