/* components/PerformanceVideoSection.jsx */
"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PerformanceVideoSection() {
  const sectionRef = useRef(null);
  const pinWrapRef = useRef(null);
  const videoRef = useRef(null);
  const h1Ref = useRef(null);
  const kpisRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pinWrap = pinWrapRef.current;
    const video = videoRef.current;
    const h1 = h1Ref.current;
    const kpis = kpisRef.current;

    if (!section || !pinWrap || !video) return;

    // --- 0) PATH / CODEC SANITY LOGS (helps you debug quickly) ---
    video.addEventListener("error", () => {
      console.warn("[PerformanceVideo] Video error. Check path/codec:", video.currentSrc || video.src);
    });

    // 1) Pin the section (3 viewport heights of scroll)
    const getEndPx = () => window.innerHeight * 3;
    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${getEndPx()}`,
      pin: pinWrap,
      pinSpacing: true,
      scrub: true,
      anticipatePin: 1,
    });

    // 2) Robust warm-up so seeking works everywhere
    let duration = 0;
    let seekReady = false;

    const warmup = async () => {
      try {
        video.muted = true;
        // Ensure autoplay begins buffering; we immediately pause later.
        // (Muted+playsInline allows autoplay on mobile)
        await video.play();
        await Promise.resolve(); // microtask to settle
        video.pause();
      } catch (e) {
        // Some browsers still reject play() until more metadata arrives; that's ok.
      }
    };

    const onLoadedMetadata = async () => {
      duration = video.duration || 0;
      await warmup();
      // Tiny nudge off 0 helps some Safari builds accept seeks
      try { video.currentTime = Math.min(0.01, duration || 0); } catch {}
    };

    const onCanPlay = () => {
      // We consider it seek-ready when we have time ranges
      const r = video.seekable;
      seekReady = !!r && r.length > 0 && duration > 0;
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("canplay", onCanPlay);

    // Retry in case metadata was late or the user scrolled early
    const metaRetry = setTimeout(() => {
      if (!duration && video.readyState >= 1) onLoadedMetadata();
    }, 800);

    // 3) Scrub currentTime with scroll (only when seekReady)
    let lastSet = -1;
    const scrubTween = gsap.to({}, {
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getEndPx()}`,
        scrub: true,
        onUpdate: (self) => {
          if (!seekReady || !duration) return;
          const t = gsap.utils.clamp(0, Math.max(0, duration - 0.05), self.progress * duration);
          if (Math.abs(lastSet - t) > 0.033) {
            try { video.currentTime = t; lastSet = t; } catch {}
          }
        },
      },
    });

    // 4) Overlays
    gsap.set([h1, kpis], { autoAlpha: 0, y: 40 });
    gsap.to(h1, {
      autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top top+=10%", end: "top top", scrub: true }
    });
    gsap.to(kpis, {
      autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top top+=35%", end: "top top+=20%", scrub: true }
    });
    gsap.to(".perf-overlay-line", {
      yPercent: -20, ease: "none",
      scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true }
    });

    // 5) Resize
    const onResize = () => {
      pinTrigger.vars.end = `+=${getEndPx()}`;
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    // 6) Prebuffer when section enters viewport (helps mobile)
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        warmup(); // best-effort
      }
    }, { threshold: 0.15 });
    io.observe(section);

    return () => {
      clearTimeout(metaRetry);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      pinTrigger?.kill();
      scrubTween?.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  return (
    <section ref={sectionRef} className="perf-section">
      <div ref={pinWrapRef} className="perf-pin-wrap">
        {/* Background video (scrubbed) */}
        <video
          ref={videoRef}
          className="perf-video"
          playsInline
          muted
          preload="auto"
          autoPlay
          // If you serve from /public, this will resolve correctly:
          // Place the file at /public/assets/samples/car-garage.mp4
          // Then use the path below:
          src="/assets/samples/car-garage.mp4"
          // If hosting the file on a CDN/domain, also add crossOrigin="anonymous"
        >
          <source src="/assets/samples/car-garage.mp4" type="video/mp4" />
        </video>

        {/* Dark gradient for contrast */}
        <div className="perf-vignette" aria-hidden />

        {/* Overlay content */}
        <div className="perf-content">
          <h2 ref={h1Ref} className="perf-heading">
            ICONIC <span className="accent">PERFORMANCE</span>
          </h2>

          <p className="perf-overlay-line">
            9-speed automatic · Twin-Turbo V6 · Intelligent 4x4
          </p>

          <div ref={kpisRef} className="perf-kpis">
            <div className="kpi">
              <span className="kpi-value">316</span>
              <span className="kpi-label">hp</span>
            </div>
            <div className="kpi">
              <span className="kpi-value">386</span>
              <span className="kpi-label">Nm</span>
            </div>
            <div className="kpi">
              <span className="kpi-value">9</span>
              <span className="kpi-label">Speed AT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Non-JS fallback */}
      <noscript>
        <style>{`.perf-video{display:none!important;}`}</style>
        <div className="perf-fallback">
          <Image src="/assets/samples/car-garage.jpg" alt="Performance" width={1920} height={1080} />
        </div>
      </noscript>

      <style jsx>{`
        .perf-section { position: relative; width: 100%; background: #000; }
        .perf-pin-wrap { position: relative; width: 100%; height: 100vh; overflow: clip; }
        .perf-video {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; background-color: #000;
        }
        .perf-vignette {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,.35) 55%, rgba(0,0,0,.65) 100%),
            linear-gradient(to bottom, rgba(0,0,0,.5) 0%, rgba(0,0,0,.2) 30%, rgba(0,0,0,.7) 100%);
        }
        .perf-content {
          position: relative; z-index: 2; height: 100%; color: #fff;
          display: grid; place-items: center; text-align: center; padding: 2rem;
        }
        .perf-heading {
          font-size: clamp(28px, 5vw, 64px); font-weight: 800; letter-spacing: .02em;
          line-height: 1.05; margin: 0 0 1rem 0; text-transform: uppercase;
        }
        .perf-heading .accent { -webkit-text-stroke: 1px rgba(255,255,255,.5); color: transparent; }
        .perf-overlay-line { font-size: clamp(14px, 2vw, 20px); opacity: .9; margin-bottom: 2rem; }
        .perf-kpis {
          display: grid; grid-template-columns: repeat(3, minmax(100px, 1fr));
          gap: clamp(12px, 2vw, 32px);
        }
        .kpi { display: grid; gap: .25rem; }
        .kpi-value { font-size: clamp(28px, 4vw, 56px); font-weight: 800; line-height: 1; }
        .kpi-label { font-size: clamp(12px, 1.6vw, 14px); text-transform: uppercase; letter-spacing: .12em; opacity: .8; }
        .perf-fallback { position: relative; width: 100%; }
      `}</style>
    </section>
  );
}
