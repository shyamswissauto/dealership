
import HeaderNav from "@/components/ar/client/HeaderNavClientAr";
import HeroSliderClient from "@/components/ar/client/pages/HeroSliderPages";

import Footer from "@/components/ar/client/FooterClient";
import RequestQuote from "@/components/demo/RequestQuote";

import ContactSection from "@/components/ar/contactpage/ContactSection";
import LocationSection from "@/components/ar/contactpage/LocationSection";



export const HERO_SLIDES = [
  {
    desktop: "/assets/hero/contact-us.webp",
    mobile:  "/assets/hero/listing-page-banner.webp",
    title:   "Contact Us",
    subtitle:"",
    align:   "left",
    valign:   "end",
    overlay: "rgba(0,0,0,0.3)",
    learnMoreHref: "",
    bookHref:      "",
    className:     "",
  },
];


export default function Page() {
  return (
      <>
        <HeaderNav />
        <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />

        <ContactSection />
        <LocationSection />


        <Footer />        
      </>
    );
  }
  