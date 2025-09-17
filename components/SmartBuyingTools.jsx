
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function useIsMobile(bp = 992) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [bp]);
  return isMobile;
}

export default function SmartBuyingTools({
  title = "SMART BUYING TOOLS",
  items = [
    { labelTop: "EXCLUSIVE", labelBottom: "OFFERS", image: "/assets/tools/img1.png", href: "#" },
    { labelTop: "EXPERIENCE", labelBottom: "THE DRIVE", image: "/assets/tools/img2.png", href: "#" },
    { labelTop: "REQUEST A", labelBottom: "QUOTE", image: "/assets/tools/img3.png", href: "#", badge: "1" },
    { labelTop: "FINANCE", labelBottom: "CALCULATOR", image: "/assets/tools/img4.png", href: "#" },
    { labelTop: "OUR", labelBottom: "LOCATION", image: "/assets/tools/img5.png", href: "#" },
    { labelTop: "VIEW", labelBottom: "BROCHURE", image: "/assets/tools/img6.png", href: "#" },
  ],
}) {
  const isMobile = useIsMobile();
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [activeIdx, setActiveIdx] = useState(0);

  const n = items.length;
  const indicatorIndex = isMobile ? activeIdx : hoverIdx >= 0 ? hoverIdx : 0;

  const prev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const next = () => setActiveIdx((i) => Math.min(n - 1, i + 1));

  const cssVars = useMemo(
    () => ({ ["--n"]: String(n), ["--i"] : String(indicatorIndex) }),
    [n, indicatorIndex]
  );

  return (
    <section className="sbt">
      <div className="container1">
        <h2 className="heading">{title}</h2>

        <div
          className={`strip ${isMobile ? "mobile" : "desktop"}`}
          onMouseLeave={() => setHoverIdx(-1)}
        >
          {isMobile && (
            <>
              <button className="navBtn prev" onClick={prev} aria-label="Previous" disabled={activeIdx === 0}>‹</button>
              <button className="navBtn next" onClick={next} aria-label="Next" disabled={activeIdx === n - 1}>›</button>
            </>
          )}

          <div className="viewport">
            <ul
              className={`tiles ${isMobile ? "asSlider" : "asOneRow"}`}
              style={
                isMobile
                  ? { transform: `translate3d(-${activeIdx * 100}%,0,0)`, ...cssVars }
                  : cssVars
              }
            >
              {items.map((it, idx) => (
                <li
                  key={idx}
                  className={`tile ${!isMobile && hoverIdx === idx ? "hovered" : ""}`}
                  onMouseEnter={() => !isMobile && setHoverIdx(idx)}
                >
                  <Link href={it.href || "#"} className="tileLink" draggable={false}>
                    <div className="imgWrap">
                      <Image
                        src={it.image}
                        alt={`${it.labelTop} ${it.labelBottom}`}
                        fill
                        className="img"
                        sizes="(max-width: 991px) 100vw, (max-width: 1500px) calc((92vw - (var(--n) - 1) * 12px) / var(--n)), 1px"
                        priority={false}
                      />
                      <span className="fade" />
                    </div>

                    <div className="caption">
                      <span className="t">{it.labelTop}</span>
                      <span className="b">{it.labelBottom}</span>
                    </div>

                    {/* {it.badge && <span className="badge">{it.badge}</span>} */}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="indicatorWrap">
          <div className="indicator" style={cssVars}>
            <span className="trackLine" />
            <span className="thumb" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .sbt {
          padding: clamp(28px, 5vw, 56px) 0;
          background: #fff;
          overflow-x: clip; 
          margin-top: 30px;
        }
        .container1 {
          width: min(1500px, 92vw);
          margin: 0 auto;
          position: relative;
        }
        .heading {
          text-align: center;
          font-weight: 800;
          letter-spacing: 0.5px;
          margin: 0 0 75px;
          font-size: 40px;
        }

        .strip { position: relative; }
        .viewport { /* overflow: hidden; */ }

        .tiles {
          padding: 0 !important;
          margin: 0;
          list-style: none;
          will-change: transform;
        }

        
        .desktop .tiles.asOneRow {
          display: grid;
          grid-auto-flow: column;
          grid-template-columns: repeat(var(--n), 1fr);
          gap: 0px;                /* adjust spacing here */
          width: 100%;
          box-shadow: -3px 28px 19px -22px rgba(0,0,0,0.36);
          -webkit-box-shadow: -3px 28px 19px -22px rgba(0,0,0,0.36);
          -moz-box-shadow: -3px 28px 19px -22px rgba(0,0,0,0.36);
        }

        .tile {
          position: relative;
          border-radius: 0px;
          overflow: hidden;
          background: #0e0f12;
          aspect-ratio: 1 / 1;      /* square tiles */
          transition: transform 420ms cubic-bezier(.2,.8,.2,1);
          will-change: transform;
        }
        .tile.hovered {
         box-shadow: 0 18px 40px rgba(0,0,0,0.28), 0 8px 18px rgba(0,0,0,0.18);
          transform: translateY(-1px) scale(1.345); /* subtle lift */
          z-index: 1;
        }

        

        .tileLink { position: relative; display: block; inset: 0; width: 100%; height: 100%; }
        .imgWrap { position: absolute; inset: 0; overflow: hidden; border-radius: inherit; }
        .img {
          object-fit: cover;
          object-position: center;
          transform: scale(1);
          transition: transform 420ms cubic-bezier(.2,.8,.2,1), filter 320ms ease;
          will-change: transform;
          filter: brightness(0.95);
        }
        .tile.hovered .img { transform: scale(1.08); filter: brightness(1); }

        .fade {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%);
          pointer-events: none;
        }

        .caption {
          position: absolute; left: 12px; right: 12px; bottom: 30px;
          color: #fff; text-shadow: 0 1px 6px rgba(0,0,0,.5);
          font-weight: 800; line-height: 1.05; letter-spacing: .5px;
          display: grid; gap: 2px; text-align: center;
        }
        .caption .t { font-size: 20px; }
        .caption .b { font-size: 20px; }

        .tiles .tile .caption > * { 
            transform: scale(1);
            transition: transform 220ms ease;
          }

          .tiles .tile.hovered .caption > * {
            transform: scale(1.1); /* ~20→26px */
          }

        .badge {
          position: absolute; top: 10px; right: 10px;
          width: 22px; height: 22px; border-radius: 50%;
          background: #e5302c; color: #fff; display: grid; place-items: center;
          font-size: 12px; font-weight: 700; box-shadow: 0 6px 14px rgba(229,48,44,.45);
        }

        
        .mobile .tiles.asSlider {
          display: flex;
          gap: 0;
          width: 100%;
          max-width: 100%;
          transition: transform 420ms cubic-bezier(.2,.8,.2,1);
          will-change: transform;
        }
        .mobile .tiles.asSlider > :global(li) { flex: 0 0 100%; min-width: 100%; }
        .mobile .tile { aspect-ratio: auto; height: 58vw; max-height: 380px; }

        .sbt, .sbt * { box-sizing: border-box; }

        .navBtn {
          position: absolute; z-index: 3; top: 50%; transform: translateY(-50%);
          width: 38px; height: 38px; border-radius: 50%; border: none;
          background: #000; color: #fff; opacity: 0.7; display: grid; place-items: center;
        }
        .navBtn:disabled { opacity: 0.25; }
        .prev { left: 6px; }
        .next { right: 6px; }

        /* Indicator */
        .indicatorWrap {
          margin-top: 50px;
          display: flex;
          justify-content: flex-end;
        }
        .indicator { position: relative; width: min(300px, 80%); height: 10px; }
        .trackLine {
          position: absolute; height: 2px; background: #c8c9cc; left: 0; right: 0; top: 4px; border-radius: 2px;
        }
        .thumb {
          position: absolute; height: 4px; top: 3px;
          width: calc(100% / var(--n));
          transform: translateX(calc(100% * var(--i)));
          background: #e5302c; border-radius: 0px;
          transition: transform 320ms cubic-bezier(.2,.8,.2,1), width 320ms ease;
          will-change: transform;
        }

        @media (max-width: 991px) {
          .viewport { overflow: hidden; position: relative; contain: paint; isolation: isolate;}
        }

        @media (max-width: 500px) {
          .mobile .tile { height: 260px; }
          .indicator { margin: 0 auto; }
          .heading {font-size: 28px; margin: 0 0 30px;}
          .indicatorWrap {margin-top: 30px;}
        }

        @media (max-width: 457px) {
          .viewport { padding-right: 0.5px; } /* eats subpixel overdraw without visual change */
        }
          
      `}</style>
    </section>
  );
}
