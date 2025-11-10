"use client";
import dynamic from "next/dynamic";

function FullBleedHeroSkeleton() {
  return (
    <div style={{position:"relative",width:"100vw"}}></div>
  );
}

const GallerySwiper = dynamic(() => import("@/components/home/GallerySwiper"), {
  ssr: false,
  loading: () => <FullBleedHeroSkeleton />,
});

export default function GallerySwiperClient() {
  return <GallerySwiper />;
}
