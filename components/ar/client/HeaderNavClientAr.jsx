"use client";
import dynamic from "next/dynamic";

function HeaderSkeleton() {
  return (
    <div style={{position:"relative",width:"100vw"}}></div>
  );
}

const HeaderNav = dynamic(() => import("@/components/ar/HeaderNav"), {
  ssr: false,
  loading: () => <HeaderSkeleton />,
});

export default function HeaderNavClientAr() {
  return <HeaderNav />;
}
