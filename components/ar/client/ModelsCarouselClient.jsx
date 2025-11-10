"use client";
import dynamic from "next/dynamic";

function BlockSkeleton({ h = 360 }) {
  return (
    <div style={{position:"relative",width:"100vw"}}></div>
  );
}

const ModelsCarouselBootstrap = dynamic(
  () => import("@/components/ar/ModelsCarouselBootstrap"),
  { ssr: false, loading: () => <BlockSkeleton /> }
);

export default function ModelsCarouselClient() {
  return <ModelsCarouselBootstrap />;
}
