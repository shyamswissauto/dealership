"use client";
import dynamic from "next/dynamic";

function WhoWeAreSkeleton() {
  return (
    <div style={{position:"relative",width:"100vw"}}></div>
  );
}

const WhoWeAreSection = dynamic(() => import("@/components/home/WhoWeAreSection"), {
  ssr: false,
  loading: () => <WhoWeAreSkeleton />,
});

export default function WhoWeAreSectionClient() {
  return <WhoWeAreSection />;
}
