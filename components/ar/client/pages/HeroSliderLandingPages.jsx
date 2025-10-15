"use client";
import dynamic from "next/dynamic";

function HeroSkeleton() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "95vh" }}>
        <div className="spinner" role="status" aria-label="Loading"></div>

        <style jsx>{`
            .spinner {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            border: 4px solid rgba(255, 255, 255, 0.25);
            border-top-color: #111; /* change to your brand color */
            transform: translate(-50%, -50%);
            animation: spin 0.8s linear infinite;
            }
            @keyframes spin {
            to {
                transform: translate(-50%, -50%) rotate(360deg);
            }
            }
            @media (prefers-reduced-motion: reduce) {
            .spinner {
                animation: none;
            }
            }
        `}</style>
        </div>
  );
}

const HeroSlider = dynamic(() => import("@/components/ar/pages/HeroSliderLandingPages"), {
  ssr: false,
  loading: () => <HeroSkeleton />,
});

export default function HeroSliderClient(props) {
  return <HeroSlider {...props} />;
}
