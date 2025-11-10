"use client";
import dynamic from "next/dynamic";

function TestDriveSkeleton() {
  return (
    <div style={{position:"relative",width:"100vw"}}></div>
  );
}

const TestDriveSection = dynamic(() => import("@/components/ar/home/TestDriveSection"), {
  ssr: false,
  loading: () => <TestDriveSkeleton />,
});

export default function TestDriveSectionClient() {
  return <TestDriveSection />;
}
