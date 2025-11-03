"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Autoplay, A11y } from "swiper/modules";
import TestDriveModal from "@/components/TestDriveModal";
import "swiper/css";

export default function HeroSlider({


  slides = [
    
    {
      desktop: "/assets/hero/bolden-landing.webp",
      mobile:  "/assets/hero/bolden-home-page-banner-m.webp",
      title:   "",
      subtitle:"",
      align:   "left",
      overlay: "rgba(0,0,0,.12)",
      learnMoreHref: "/models/",
      bookHref:      "/",
      className:     "slide-pure-design",
    },
    {
      desktop: "/assets/hero/bolden-s9-hero-slider.webp",
      mobile:  "/assets/hero/off-road-mobile.webp",
      title:   "Power That Conquers Any Terrain",
      subtitle:"From deserts to mountains, the Bolden Off-Road is built to dominate every challenge.",
      align:   "left",
      overlay: "rgba(0,0,0,.42)",
      learnMoreHref: "/models/bolden-s9-off-road",
      bookHref:      "/",
      className:     "slide-pure-design",
    },
    {
      desktop: "/assets/hero/bolden-heroslider.webp",
      mobile:  "/assets/hero/passenger-mobile.webp",
      title:   "Bolden S7 Passenger. Redefining Everyday Luxury",
      subtitle:"A perfect blend of modern design and powerful performance, built for those who value more.",
      align:   "center",
      overlay: "rgba(0,0,0,.42)",
      learnMoreHref: "/models/bolden-s7-passenger",
      bookHref:      "/",
      className:     "slide-pure-design",
    },
    {
      desktop: "/assets/hero/bolden-s6-hero-slider.webp",
      mobile:  "/assets/hero/commericial-mobile.webp",
      title:   "Bolden S6 Commercial. Strength You Can Trust.",
      subtitle:"Built for performance, trusted for productivity — that’s Bolden Commercial.",
      align:   "right",
      overlay: "rgba(0,0,0,.42)",
      learnMoreHref: "/models/bolden-s6-commercial",
      bookHref:      "/",
      className:     "slide-pure-design",
    },
  ],
  autoPlayMs = 7000,
}) {
  const swiperRef = useRef(null);
   const firstImgRef = useRef(null);
  const [active, setActive] = useState(0);
  const [railOpen, setRailOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const current = slides[active] || slides[0];

  
  useEffect(() => {
    
    if (firstImgRef.current) {
      
      firstImgRef.current.setAttribute("fetchpriority", "high");
    }
  }, []);

  /* useEffect(() => {
    const open = () => setRailOpen(true);
    window.addEventListener("hero:open-rail", open);
    return () => window.removeEventListener("hero:open-rail", open);
  }, []); */

  return (
    <section className="hero reveal-up">
      
      <Swiper
        modules={[Keyboard, Autoplay, A11y]}
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={(s) => setActive(s.realIndex)}
        loop
        keyboard={{ enabled: true }}
        autoplay={{ delay: autoPlayMs, disableOnInteraction: false }}
        speed={800}
        allowTouchMove
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i} className={s.className || ""}>
            <div className="slide">
              <div className="bgWrap" aria-hidden="true">
                <picture>
                    <source media="(min-width: 768px)" srcSet={s.desktop} />
                    <img
                        src={s.mobile}
                        alt={s.title}
                        className="bg"
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={i === 0 ? "high" : "auto"}
                    />
                </picture>
              </div>
              <div className="colorOverlay" style={{ background: s.overlay }} />

              
              <div className="wrap uiText">
                <div className={`copy align-${s.align}`}>
                  <h2 className="title slide-in-up">{s.title}</h2>
                  {s.subtitle && <p className="subtitle">{s.subtitle}</p>}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      
      <div className="wrap fixedUi">
        <div className="arrows">
          <button className="arrow prev" aria-label="Previous" onClick={() => swiperRef.current?.slidePrev()}>
            ‹
          </button>
          <button className="arrow next" aria-label="Next" onClick={() => swiperRef.current?.slideNext()}>
            ›
          </button>
        </div>

        <div className="cta">
          
          <Link href={current.learnMoreHref} className="solid cstBtnStyle1">LEARN MORE</Link>
          <button onClick={() => setOpen(true)} className="solid cstBtnStyle1 ">TEST DRIVE</button>
          {/* <button onClick={() => setOpen(true)} className="btn solid cstBtnStyle ">TEST DRIVE</button> */}
          {/* <Link href={current.bookHref} className="btn solid cstBtnStyle">BOOK A TEST DRIVE</Link> */}
        </div>
      </div>

      {open && (
              <TestDriveModal
                onClose={() => setOpen(false)}
                modalImage="/assets/popup/book-test-drive-home.webp"
                carOptions={["Bolden Off-Road", "Bolden Passenger", "Bolden Commercial"]}
              />
            )}

      
      {/* <div className={`railScrim ${railOpen ? "show" : ""}`} onClick={() => setRailOpen(false)} />
      <aside className={`rail ${railOpen ? "open" : ""}`}>
        <div className="railInner">
          <h4>Quick Actions</h4>
          <Link href="/test-drive">Book a Test Drive</Link>
          <Link href="/showroom">Find a Showroom</Link>
          <Link href="/special-offers">Special Offers</Link>
          <Link href="/service-parts">Service & Parts</Link>
        </div>
        <button className="railClose" aria-label="Close" onClick={() => setRailOpen(false)}>×</button>
      </aside> */}

      <style jsx>{`
        .hero { position: relative; width: 100%; height: 100svh; min-height: 520px; overflow: hidden; color: #fff; }
        :global(.swiper), :global(.swiper-wrapper), :global(.swiper-slide) { height: 100%; z-index: 0; } /* keep below overlays */

        .slide { position: relative; width: 100%; height: 100%; }
        .bgWrap { position: absolute; inset: 0; z-index: -3; }
        .bg { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
        .colorOverlay { position: absolute; inset: 0; z-index: -2; }

        .wrap { width: min(1500px, 92vw); margin: 0 auto; }
        .uiText { position: relative; height: 100%; z-index: 1; }
        .copy { position: absolute; inset: 0; display: grid; align-content: center; gap: .5rem; padding: clamp(16px, 4vw, 40px); text-shadow: 0 2px 10px rgba(0,0,0,.35); }
        .align-left   { justify-items: start;  text-align: left;  padding-left: clamp(16px, 6vw, 0); }
        .align-center { justify-items: center; text-align: center; }
        .align-right  { justify-items: end;    text-align: right; padding-right: clamp(16px, 6vw, 0); }
        .title    { margin: 0; font-weight: 800; line-height: 1.05; font-size: clamp(28px, 4vw, 46px); }
        .subtitle { margin: 6px 0 0; max-width: min(720px, 90vw); font-size: clamp(14px, 1.4vw, 18px); opacity: .95; }

        
        .fixedUi {
          position: absolute; inset: 0; pointer-events: none;
          z-index: 10; /* ensure above swiper images */
        }
        .arrows {
          position: absolute; left: 0; right: 0;
          bottom: clamp(14px, 4.8vw, 80px);
          display: flex; justify-content: space-between;
          z-index: 1;
        }
        .arrow {
          pointer-events: auto;
          width: 46px; height: 46px; border-radius: 50%; border: 0;
          background: rgba(255,255,255,0); color: #ffffff; font-size: 80px; line-height:15px;
          display: grid; place-items: center; cursor: pointer;          
        }
        .cta {
          pointer-events: auto;
          position: absolute; right: 80px;
          bottom: clamp(14px, 4.8vw, 80px);
          display: inline-flex; gap: 12px; flex-wrap: wrap;
          justify-content: center;
        }
        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 0px 18px; border-radius: 999px; text-decoration: none;
          font-weight: 800; letter-spacing: .04em; font-size: 13px;
          transition: transform .2s, box-shadow .2s, background .2s, color .2s;
          backdrop-filter: saturate(140%);
        }

        


        
        
        /* .ghost { background: rgba(255,255,255,.92); color: #000; }
        .ghost:hover { background: #fff; transform: translateY(-1px); box-shadow: 0 10px 26px rgba(0,0,0,.22); }
        .solid { background: #111; color: #fff; }
        .solid:hover { background: #000; transform: translateY(-1px); } */

        @media (max-width: 575px) {
          .btn { padding: 10px 14px; font-size: 12px; }
          .arrow { width: 40px; height: 40px; }
        }

        @media (max-width: 575px) {
          .cta {
            left: 0;
            right: 0;
            bottom: 25px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }

          .cta :global(a.cstBtnStyle1),
          .cta :global(button.cstBtnStyle1) {
            /* width: min(260px, 90vw); */
            justify-content: center;
            text-align: center;
            flex: 0 0 auto;
          }
        }

        /* Right Rail — desktop only */
        .railScrim {
          position: fixed; inset: 0; background: rgba(0,0,0,.35);
          opacity: 0; pointer-events: none; transition: .2s; z-index: 29;
        }
        .railScrim.show { opacity: 1; pointer-events: auto; }
        .rail {
          position: fixed; inset: 0 0 0 auto; width: 340px; background: #0f1114; color: #fff;
          translate: 100% 0; transition: translate .28s ease; z-index: 30; display: none;
          box-shadow: -20px 0 40px rgba(0,0,0,.35);
        }
        .rail.open { translate: 0 0; }
        .railInner { padding: 22px; display: grid; gap: 14px; }
        .railInner h4 { margin: 0 0 6px; }
        .railInner a { color: #fff; text-decoration: none; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,.08); }
        .railClose {
          position: absolute; top: 10px; right: 10px; width: 36px; height: 36px;
          border-radius: 50%; border: 0; background: #fff; color: #000; cursor: pointer;
          font-size: 37px;
          line-height: 34px;
          display: inline-block;
          transition: transform 0.1s ease-in-out;
        }
        .railClose:hover {
          transform: rotate(90deg); /* rotate 90 degrees */
        }
        @media (min-width: 992px) { .rail { display: block; } }
        @media (max-width: 991px) { .railScrim, .rail { display: none; } }


      `}</style>
    </section>
  );
}
