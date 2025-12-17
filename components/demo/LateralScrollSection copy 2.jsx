"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Demo content: mix of images and a video panel
const ITEMS = [
  {
    kind: "image",
    title: "All-Terrain Mastery",
    copy: "Switchable drive modes optimize traction across sand, rock, and tarmac.",
    src: "/assets/samples/car-garage.jpg",
  },
  {
    kind: "image",
    title: "Intelligent 4x4",
    copy: "Real-time torque split for confidence in tight, technical sections.",
    src: "/assets/samples/car-repair-service.jpg",
  },
  {
    kind: "video",
    title: "Twin‑Turbo V6 (Clip)",
    copy: "Broad, usable torque band for that effortless surge.",
    src: "/assets/samples/car-garage.mp4", // H.264 MP4; place in /public/videos
    poster: "/assets/samples/car-garage.jpg",
  },
  {
    kind: "image",
    title: "Chassis Control",
    copy: "Active body management keeps you flat and planted.",
    src: "/assets/samples/car-repair-service.jpg",
  },
];

export default function LateralScrollSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const videoRefs = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const getScrollDistance = () => {
      const viewportW = window.innerWidth;
      const panelWidth = track.scrollWidth;
      return Math.max(0, panelWidth - viewportW);
    };

    const setupPinnedHorizontal = () => {
      const scrollDistance = getScrollDistance();

      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.to(track, { x: -scrollDistance });

      const totalPanels = track.querySelectorAll(".panel").length;
      const endDistance = scrollDistance || 1;

      const pinST = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${endDistance}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        snap: totalPanels > 1
          ? {
              snapTo: 1 / (totalPanels - 1),
              duration: 0.2,
              ease: "power1.inOut",
            }
          : false,
        animation: tl,
      });

      // Reveal animations per-panel
      gsap.utils.toArray(".panel .panel-inner").forEach((el) => {
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
              containerAnimation: tl,
              start: "left center",
              end: "right center",
              scrub: true,
            },
          }
        );
      });

      // Play/pause videos only when panel is visible
      gsap.utils.toArray(".panel").forEach((panel, idx) => {
        const video = videoRefs.current[idx];
        if (video && video.tagName === "VIDEO") {
          ScrollTrigger.create({
            trigger: panel,
            containerAnimation: tl,
            start: "left center",
            end: "right center",
            onEnter: () => video.play().catch(() => {}),
            onEnterBack: () => video.play().catch(() => {}),
            onLeave: () => video.pause(),
            onLeaveBack: () => video.pause(),
          });
        }
      });

      // Progress bar
      const progressBar = section.querySelector(".lat-progress .bar");
      if (progressBar) {
        gsap.fromTo(
          progressBar,
          { width: "0%" },
          {
            width: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${endDistance}`,
              scrub: true,
            },
          }
        );
      }

      const onResize = () => {
        const d = getScrollDistance();
        tl.clear();
        tl.to(track, { x: -d, duration: 0 });
        pinST.vars.end = `+=${Math.max(1, d)}`;
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        tl.kill();
        pinST.kill();
        ScrollTrigger.getAll().forEach((t) => t.refresh());
      };
    };

    const cleanup = setupPinnedHorizontal();
    return () => {
      cleanup && cleanup();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="lat-section">
      <div className="lat-wrapper">
        <h2 className="lat-heading">
          Lateral <span>Scroll</span> Highlights
        </h2>

        <div ref={trackRef} className="lat-track">
          {ITEMS.map((item, idx) => (
            <article className="panel" key={idx}>
              <div className="media-wrap">
                {item.kind === "video" ? (
                  <video
                    ref={(el) => (videoRefs.current[idx] = el)}
                    className="media-video"
                    src={item.src}
                    poster={item.poster}
                    playsInline
                    muted
                    preload="metadata"
                  />
                ) : (
                  <img src={item.src} alt={item.title} loading="lazy" />
                )}
              </div>
              <div className="panel-inner">
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>

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
          height: 100vh; /* pinned viewport on all screens */
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
        .media-wrap img,
        .media-video {
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
        }

        @media (max-width: 767px) {
          .lat-heading {
            top: 16px;
            left: 16px;
          }
          .lat-progress {
            left: 16px;
            right: 16px;
            width: auto;
          }
          .lat-track {
            grid-auto-columns: 90vw; /* tighter on small screens */
            gap: 16px;
            padding: 0 16px;
          }
          .panel {
            height: min(70vh, 540px);
          }
          .panel-inner {
            left: 12px;
            right: 12px;
            bottom: 12px;
          }
        }
      `}</style>

    </section>
  );
}
