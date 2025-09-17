"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function HeaderNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeBtnRef = useRef(null);

  const openHeroRail = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hero:open-rail"));
    }
  };


  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  
  useEffect(() => {
    if (mobileOpen) {
      closeBtnRef.current?.focus();
    }
  }, [mobileOpen]);

  return (
    <header className="siteHeader reveal-up">
      <div className="wrap bar">
        
        <Link href="/" className="logo">
          <img src="/assets/logo.png" alt="Sinotruk" width={180} />
        </Link>

        
        <nav className="nav">
          <Link href="/models" className="cstTransY">Models</Link>
          <Link href="/showroom" className="cstTransY">Showroom</Link>
          <Link href="/special-offers" className="cstTransY">Special Offers</Link>
          <Link href="/service-parts" className="cstTransY">Service Parts</Link>
          <Link href="/business" className="cstTransY">VGV Business</Link>
          <Link href="/contact" className="cstTransY">Contact</Link>
        </nav>

        
        <div className="right">
          <Link href="/test-drive" className="cta btn cstBtnStyle hideMobile">TEST DRIVE</Link>
          <Link href="/ar" className="ar cstTransY">العربية</Link>

          
          <button className="railBtn" aria-label="Open Quick Menu" onClick={openHeroRail}>
            ☰
          </button>

          
          <button
            className={`hamburger ${mobileOpen ? "open" : ""}`}
            aria-label="Open Menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
            onClick={() => setMobileOpen((s) => !s)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      
      <div className={`scrim ${mobileOpen ? "show" : ""}`} onClick={() => setMobileOpen(false)} />
      <aside
        id="mobile-drawer"
        className={`drawer ${mobileOpen ? "open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <div className="drawerInner">
          
          <button
            ref={closeBtnRef}
            className="drawerClose"
            aria-label="Close Menu"
            onClick={() => setMobileOpen(false)}
          >
            ✕
          </button>

          
          <Link href="/models" onClick={() => setMobileOpen(false)}>Models</Link>
          <Link href="/showroom" onClick={() => setMobileOpen(false)}>Showroom</Link>
          <Link href="/special-offers" onClick={() => setMobileOpen(false)}>Special Offers</Link>
          <Link href="/service-parts" onClick={() => setMobileOpen(false)}>Service Parts</Link>
          <Link href="/business" onClick={() => setMobileOpen(false)}>VGV Business</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
        </div>
      </aside>

      <style jsx>{`
        .siteHeader {
          position: absolute;
          inset: 0 0 auto 0;
          z-index: 20;
          color: #fff;
        }

        .ar > .siteHeader {
          direction: rtl;
        }
        
        .wrap { width: min(1500px, 92vw); margin: 0 auto; }
        .bar {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 24px;
          padding: 18px 0;
          margin-top: 40px;
        }
        .logo { color: #fff; text-decoration: none; font-weight: 900; letter-spacing: .15em; }

        .nav {
          display: flex;
          justify-content: center;
          gap: clamp(14px, 2.2vw, 28px);
        }
        .nav a { color: #fff; text-decoration: none; font-weight: 700; opacity: .9; }
        .nav a:hover { opacity: 1; }

        .right { display: flex; align-items: center; gap: 30px; justify-content: end;}
        .cta {
          text-decoration: none;
          background: #fff; color: #000;
          font-weight: 800; padding: 10px 14px; border-radius: 999px;
        }
        .ar { color: #fff; text-decoration: none; font-weight: 800; opacity: .9; }

        .railBtn {
          width: 42px; height: 42px; border-radius: 50%;
          border: 0; background: rgba(255,255,255,.95); color: #000;
          box-shadow: 0 10px 26px rgba(0,0,0,.18);
          cursor: pointer;
        }

        .hamburger {
          display: none;
          width: 38px; height: 38px;
          border: 0; background: rgba(255,255,255,.12);
          border-radius: 8px; cursor: pointer; position: relative;
        }
        .hamburger span {
          position: absolute; left: 8px; right: 8px; height: 3px; background: #fff;
          transition: transform .3s, top .3s, opacity .2s;
          border-radius: 999px;
        }
        .hamburger span:nth-child(1){ top: 12px; }
        .hamburger span:nth-child(2){ top: 18px; }
        .hamburger span:nth-child(3){ top: 24px; }
        .hamburger.open span:nth-child(1){ top: 18px; transform: rotate(45deg); }
        .hamburger.open span:nth-child(2){ opacity: 0; }
        .hamburger.open span:nth-child(3){ top: 18px; transform: rotate(-45deg); }

        .scrim { position: fixed; inset: 0; background: rgba(0,0,0,.35); opacity: 0; pointer-events: none; transition: .2s; z-index: 19; }
        .scrim.show { opacity: 1; pointer-events: auto; }

        .drawer {
          position: fixed; inset: 0 0 0 auto; width: 76vw; max-width: 340px;
          background: #0f1114; color: #fff; translate: 100% 0;
          transition: translate .28s ease; z-index: 20; display: none;
        }
        .drawer.open { translate: 0 0; }
        .drawerInner { padding: 18px 18px 24px; display: grid; gap: 14px; position: relative; }

        
        .drawerClose {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 0;
          background: rgba(255,255,255,0.12);
          color: #fff;
          font-size: 18px;
          cursor: pointer;
        }
        .drawerClose:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 2px;
        }

        .drawerInner a {
          color: #fff; text-decoration: none; padding: 12px 6px; border-bottom: 1px solid rgba(255,255,255,.08);
        }

        @media (max-width: 991px) {
          .nav { display: none; }
          .railBtn { display: none; }
          .hamburger { display: inline-block; }
          .drawer { display: block; }
          .bar {margin-top:0px;}
        }

        
      `}</style>
    </header>
  );
}
