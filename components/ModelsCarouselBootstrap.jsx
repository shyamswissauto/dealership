// components/ModelsCarouselBootstrap.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

const MODELS = [
  {
    name: "U75PLUS",
    img: "/assets/models/img5.webp",
    hoverImg: "/models/img2.png",
    href: "/",
  },
  {
    name: "U70PRO",
    img: "/assets/models/img4.webp",
    hoverImg: "/models/img1.png",
    href: "/models/sinotruk-vgv-u70-pro",
  },
  {
    name: "OFF ROAD TYPE",
    img: "/assets/models/img2.webp",
    hoverImg: "/models/img4.png",
    href: "/models/bolden-off-road",
  },
  {
    name: "PASSENGER",
    img: "/assets/models/img3.webp",
    hoverImg: "/models/img3.png",
    href: "/",
  },
  {
    name: "COMMERCIAL",
    img: "/assets/models/img1.webp",
    hoverImg: "/models/img2.png",
    href: "/",
  },
];

export default function ModelsCarouselBootstrap() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const [showNav, setShowNav] = useState(true);

  const BREAKPOINTS = useMemo(
    () => ({
      0: { slidesPerView: 1, spaceBetween: 16 },
      576: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 3, spaceBetween: 24 },
      992: { slidesPerView: 4, spaceBetween: 24 },
      1200: { slidesPerView: 5, spaceBetween: 24 },
    }),
    []
  );

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;
    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    if (swiper.navigation?.initialized) swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, [prevRef, nextRef]);

  const computeSlidesPerView = (swiper) => {
    if (!swiper) return 1;
    const bp = swiper.currentBreakpoint;
    const opt = bp ? swiper.params.breakpoints?.[bp] : null;
    const spv = (opt && opt.slidesPerView) ?? swiper.params.slidesPerView ?? 1;
    return typeof spv === "number" ? spv : 1;
  };

  const updateNav = (swiper) => {
    const spv = computeSlidesPerView(swiper);
    setShowNav(MODELS.length > spv);
  };

  return (
    <section className="models-wrap">
      <div className="container1">
        <div className="titleRow">
          <span className="line" />
          <h2 className="models-title">MODEL</h2>
          <span className="line" />
        </div>

        <div className="navRow">
          <button
            ref={prevRef}
            type="button"
            className={`navBtn ${showNav ? "" : "hidden"}`}
            aria-label="Previous"
          >
            ‹
          </button>

          <div className="swiperCol">
            <Swiper
              modules={[Navigation, Autoplay]}
              onBeforeInit={(swiper) => (swiperRef.current = swiper)}
              onInit={updateNav}
              onResize={updateNav}
              onBreakpoint={updateNav}
              navigation={{ enabled: true }}
              breakpoints={BREAKPOINTS}
              loop={false}
              rewind={true}
              watchOverflow={true}
              allowTouchMove={MODELS.length > 1}
              autoplay={
                MODELS.length > 1
                  ? {
                      delay: 3000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }
                  : false
              }
              className="swiperWrap"
            >
              {MODELS.map((m, i) => (
                <SwiperSlide key={m.name} className="slide">
                  <Link
                    href={m.href}
                    className="cardLink animateOnHover"
                    aria-label={m.name}
                  >
                    <div
                      className="imgBox animate__animated"
                      style={{ "--animate-name": "fadeInUp" }}
                    >
                      <Image
                        src={m.img}
                        alt={m.name}
                        fill
                        className="img base"
                        sizes="(max-width: 575px) 85vw, (max-width: 991px) 40vw, 18vw"
                        priority={i < 2}
                      />
                    </div>
                    <div className="modelName">{m.name}</div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <button
            ref={nextRef}
            type="button"
            className={`navBtn ${showNav ? "" : "hidden"}`}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>

      <style jsx>{`
        .models-wrap {
          padding: clamp(28px, 6vw, 90px) 0;
          background: url("/assets/hero/models-bg.webp") center/cover no-repeat;
          overflow-x: clip;
        }
        .container1 {
          width: min(1500px, 92vw);
          margin: 0 auto;
        }

        .titleRow {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: clamp(12px, 7vw, 40px);
          margin-bottom: clamp(16px, 4vw, 45px);
        }
        .models-title {
          margin: 0;
          letter-spacing: 0.25em;
          font-weight: 800;
          color: #fff;
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);
        }
        .line {
          height: 1px;
          background: rgba(255, 255, 255, 0.8);
          margin-left: 70px;
          margin-right: 70px;
        }

        .navRow {
          display: grid;
          grid-template-columns: 44px 1fr 44px;
          align-items: center;
          gap: 12px;
        }
        .swiperCol {
          min-width: 0;
        }
        .swiperWrap {
          width: 100%;
        }
        .swiperWrap :global(.swiper-wrapper) {
          align-items: stretch;
        }
        .swiperWrap :global(.swiper-slide) {
          display: flex;
          justify-content: center;
          height: auto;
        }

        .navBtn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 0;
          background: #fff;
          color: #000;
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.18);
          display: grid;
          place-items: center;
          font-size: 28px;
          line-height: 1;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .navBtn:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.22);
        }
        .navBtn.hidden {
          visibility: hidden;
        }

        .cardLink {
          width: 100%;
          max-width: 300px;
          text-decoration: none;
          text-align: center;
          color: #111;
          display: grid;
          gap: 10px;
          will-change: transform, box-shadow;
          transition: transform 220ms ease, box-shadow 220ms ease;
        }

        .imgBox {
          position: relative;
          width: 100%;
          aspect-ratio: 16/10;
          border-radius: 12px;
          overflow: hidden;
        }
        .img {
          object-fit: contain;
          transition: transform 320ms ease, opacity 220ms ease;
          width: auto !important;
        }
        .modelName {
          letter-spacing: 0.06em;
          color: #111;
          text-align: center;
          font-size: 15px;
          font-weight: normal;
          font-family: var(--font-poppins), system-ui, -apple-system, sans-serif;
        }

        .models-wrap .swiper-button-prev,
        .models-wrap .swiper-button-next {
          display: none !important;
        }



        @media (max-width: 575px) {
          .navRow {
            grid-template-columns: 38px 1fr 38px;
          }
          .navBtn {
            width: 38px;
            height: 38px;
            font-size: 24px;
          }
          .cardLink {
            max-width: 360px;
          }
          .line {
            height: 1px;
            opacity: 0.9;
            margin-left: 20px;
            margin-right: 20px;
          }
        }
        @media (min-width: 1200px) {
          .navRow {
            grid-template-columns: 0px 1fr 0px;
          }
        }
      `}</style>
    </section>
  );
}
