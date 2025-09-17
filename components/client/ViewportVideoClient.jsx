"use client";
import dynamic from "next/dynamic";

const ViewportVideoSection = dynamic(
  () => import("@/components/home/ViewportVideoSection"),
  {
    ssr: false,
    loading: () => (
      <div style={{position:"relative",width:"100vw"}}></div>
    ),
  }
);

export default function ViewportVideoClient() {
  return <ViewportVideoSection />;
}
