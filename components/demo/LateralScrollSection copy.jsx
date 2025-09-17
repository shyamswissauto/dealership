"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  {
    title: "All-Terrain Mastery",
    copy: "Switchable drive modes optimize traction across sand, rock, and tarmac.",
    media: "/assets/samples/car-garage.jpg", // 1920x1080 (or similar)
  },
  {
    title: "Intelligent 4x4",
    copy: "Real-time torque split for confidence in tight, technical sections.",
    media: "/assets/samples/car-repair-service.jpg",
  },
  {
    title: "Twin-Turbo V6",
    copy: "Broad, usable torque band for that effortless surge.",
    media: "/assets/samples/car-garage.jpg",
  },
  {
    title: "Chassis Control",
    copy: "Active body management keeps you flat and planted.",
    media: "/assets/samples/car-repair-service.jpg",
  },
];

export default function LateralScrollSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    // If small screens: let it be natively scrollable (no pinning)
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const totalPanels = track.querySelectorAll(".panel").length;
      const panelWidth = track.scrollWidth; // full width of the horizontal track
      const viewportW = window.innerWidth;
      const scrollDistance = panelWidth - viewportW; // how far we need to translate X

      // Pin the section and scrub the horizontal translation
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance}`, // scroll length maps to track width
          pin: true,
          scrub: true,
          anticipatePin: 1,
        },
      });

      // Move the track left as user scrolls down
      tl.to(track, { x: -scrollDistance });

      // Optional: staggered fades on each panel content
      gsap.utils.toArray(".panel .panel-inner").forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "left center",
              end: "right center",
              scrub: true,
              horizontal: true, // still works because parent is being translated
              containerAnimation: tl, // link to main timeline for correct positions
            },
          }
        );
      });

      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="lat-section">
      <div className="lat-wrapper">
        <h2 className="lat-heading">
          Lateral <span>Scroll</span> Highlights
        </h2>

        {/* Track (the thing that moves horizontally) */}
        <div ref={trackRef} className="lat-track">
          {ITEMS.map((item, idx) => (
            <article className="panel" key={idx}>
              <div className="media-wrap">
                <img src={item.media} alt={item.title} loading="lazy" />
              </div>
              <div className="panel-inner">
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Progress bar (desktop) */}
        <div className="lat-progress" aria-hidden>
          <div className="bar" />
        </div>
      </div>

      <style jsx>{`
        .lat-section {
          position: relative;
          background: #0a0a0a;
          color: #fff;
          overflow: clip;
        }

        .lat-wrapper {
          position: relative;
          height: 100vh; /* pinned viewport on desktop */
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .lat-heading {
          position: absolute;
          top: 24px;
          left: 24px;
          z-index: 5;
          font-size: clamp(18px, 2.2vw, 28px);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          opacity: 0.95;
        }
        .lat-heading span {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.6);
          color: transparent;
        }

        .lat-track {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: min(85vw, 1200px);
          gap: clamp(16px, 2vw, 32px);
          align-items: center;
          padding: 0 clamp(24px, 4vw, 48px);
          will-change: transform;
        }

        .panel {
          position: relative;
          height: clamp(420px, 70vh, 760px);
          border-radius: 24px;
          overflow: hidden;
          background: #111;
          display: grid;
          grid-template-rows: 1fr auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }

        .media-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .media-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1.03);
        }

        .panel-inner {
          position: absolute;
          left: 20px;
          bottom: 20px;
          right: 20px;
          padding: clamp(12px, 2vw, 20px);
          border-radius: 16px;
          backdrop-filter: blur(6px);
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.55),
            rgba(0, 0, 0, 0.2)
          );
        }
        .panel-inner h3 {
          margin: 0 0 6px;
          font-size: clamp(18px, 2.4vw, 28px);
          font-weight: 800;
          letter-spacing: 0.02em;
        }
        .panel-inner p {
          margin: 0;
          opacity: 0.9;
          font-size: clamp(13px, 1.4vw, 16px);
          line-height: 1.5;
        }

        .lat-progress {
          position: absolute;
          left: 24px;
          bottom: 24px;
          width: clamp(180px, 20vw, 320px);
          height: 3px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 3px;
          overflow: hidden;
        }
        .lat-progress .bar {
          width: 0%;
          height: 100%;
          background: #fff;
          animation: grow 2s linear forwards paused;
        }

        /* MOBILE FALLBACK: no pin, native horizontal scroll-snap */
        @media (max-width: 767px) {
          .lat-wrapper {
            height: auto;
            padding: 48px 0 24px;
          }
          .lat-track {
            position: relative;
            overflow-x: auto;
            overflow-y: hidden;
            height: auto;
            padding-block: 16px;
            scroll-snap-type: x mandatory;
          }
          .panel {
            scroll-snap-align: start;
            height: auto;
            min-height: 60vh;
          }
          .lat-progress {
            display: none;
          }
        }

        @keyframes grow {
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
