"use client";
import dynamic from "next/dynamic";

function FooterSkeleton() {
  return (
    <div style={{position:"relative",width:"100vw"}}></div>
  );
}

const Footer = dynamic(() => import("@/components/ar/FooterLandingPage"), {
  ssr: false,
  loading: () => <FooterSkeleton />,
});

export default function FooterClient() {
  return <Footer />;
}
