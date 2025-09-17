"use client";
import dynamic from "next/dynamic";

function HeaderSkeleton() {
  return (
    <div style={{position:"relative",width:"100vw"}}></div>
  );
}

const HeaderNav = dynamic(() => import("@/components/HeaderNav"), {
  ssr: false,
  loading: () => <HeaderSkeleton />,
});

export default function HeaderNavClient() {
  return <HeaderNav />;
}
