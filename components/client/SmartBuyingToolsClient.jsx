"use client";
import dynamic from "next/dynamic";

function BlockSkeleton({ h = 320 }) {
  return (
    <div style={{position:"relative",width:"100vw"}}></div>
  );
}

const SmartBuyingTools = dynamic(() => import("@/components/SmartBuyingTools"), {
  ssr: false,
  loading: () => <BlockSkeleton h={320} />,
});

export default function SmartBuyingToolsClient() {
  return <SmartBuyingTools />;
}
