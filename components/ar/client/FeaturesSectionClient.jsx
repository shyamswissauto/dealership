"use client";
import dynamic from "next/dynamic";

function FeaturesSkeleton() {
  return (
    <div style={{position:"relative",width:"100vw"}}></div>
  );
}

const FeaturesSection = dynamic(() => import("@/components/ar/home/FeaturesSection"), {
  ssr: false,
  loading: () => <FeaturesSkeleton />,
});

export default function FeaturesSectionClient() {
  return <FeaturesSection />;
}
