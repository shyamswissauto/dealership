
import HeaderNav from "@/components/client/HeaderNavClient";
import HeroSliderClient from "@/components/client/pages/HeroSliderPages";

import Footer from "@/components/client/FooterClient";
import Link from "next/link";

export function generateMetadata() {
    return {
        title: "404 - Page Not Found | Sinotruk Bolden",
        description: "Oops! The page you’re looking for doesn’t exist.",
        openGraph: {
            title: "404 - Page Not Found | Sinotruk Bolden",
            description: "Oops! The page you’re looking for doesn’t exist.",
            images: [
                {
                    url: 'assets/images/og/sinotruk.png',
                    alt: "404 Error Image",
                },
            ],
        },
    };
}

export const HERO_SLIDES = [
    {
        desktop: "/assets/hero/business-page.webp",
        mobile: "/assets/hero/listing-page-banner.webp",
        title: "404 - Page Not Found",
        subtitle: "",
        align: "left",
        valign: "end",
        overlay: "rgba(0,0,0,0.8)",
        learnMoreHref: "",
        bookHref: "",
        className: "",
    },
];
export default function Error404() {

    return (
        <>
            <HeaderNav />
            <HeroSliderClient slides={HERO_SLIDES} autoPlayMs={6000} />

            <div className="pageNotFound" style={{ height: "50vh" }}>
                <h3>Oops! The page you’re looking for doesn’t exist.</h3>
                <Link href={"/"} className="loadMoreBtn" >Back to Home</Link>
            </div>



            <Footer />
        </>
    )
}
