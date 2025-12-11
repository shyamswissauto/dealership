"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import TestDriveModal from "@/components/ar/TestDriveModal";
import LanguageSwitcher from "../LanguageSwitcher";

export default function HeaderNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
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
    <header className="siteHeader reveal-up dirRtl">
      <div className="wrap bar">
        
        <Link href="/" className="logo">
          <img src="/assets/sinotruk-logo.png" alt="Sinotruk" width={180} />
        </Link>

        
        <nav className="nav">
          <Link href="/models" className="cstTransY">الموديلات</Link>
          <Link href="/special-offers" className="cstTransY">العروض الخاصة</Link>
          <Link href="/bolden-business" className="cstTransY">بولدن للأعمل</Link>
          <Link href="/contact-us" className="cstTransY">التواصل</Link>
        </nav>

        
        <div className="right">
          {/* <Link href="/test-drive" className="cta btn cstBtnStyle hideMobile">TEST DRIVE</Link> */}
          <LanguageSwitcher />
          <button onClick={() => setOpen(true)} className="cta btn cstBtnStyle hideMobile cstHeadTest">تجربة قيادة</button>
          {/* <Link href="/" className="ar cstTransY">العربية</Link> */}
          

          
          {/* <button className="railBtn" aria-label="Open Quick Menu" onClick={openHeroRail}>
            ☰
          </button> */}

          
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

          <div className="mLinks">
              <Link href="/models" onClick={() => setMobileOpen(false)}>الموديلات</Link>
              {/* <Link href="/" onClick={() => setMobileOpen(false)}>Showroom</Link> */}
              <Link href="/special-offers" onClick={() => setMobileOpen(false)}>العروض الخاصة</Link>
              {/* <Link href="/service-and-parts" onClick={() => setMobileOpen(false)}>Service & Parts</Link> */}
              <Link href="/bolden-business" onClick={() => setMobileOpen(false)}>بولدن للأعمل</Link>
              <Link href="/contact-us" onClick={() => setMobileOpen(false)}>التواصل</Link>

              <div className="headerSocial">
                  <ul className="socials" aria-label="Social media">
                      <li>
                        <Link href="https://www.facebook.com/people/Sinotruk-UAE/61579914192315/" aria-label="Facebook" className="socialLink" target="_blank" rel="noopener noreferrer">
                          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                            <path fill="currentColor" d="M13 10h3l-1 4h-2v7h-4v-7H7v-4h2V8a4 4 0 0 1 4-4h3v4h-3a1 1 0 0 0-1 1v1z"/>
                          </svg>
                        </Link>
                      </li>
                      <li>
                        <Link href="https://x.com/SinotrukUAE" aria-label="X" className="socialLink" target="_blank" rel="noopener noreferrer">
                          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                            <path fill="currentColor" d="M3 4l8.1 9.7L3.7 20H6l6.2-5.5L17.6 20H21l-8.5-10L20.3 4H18L12.2 9.1 8.1 4z"/>
                          </svg>
                        </Link>
                      </li>
                      <li>
                        <Link href="https://www.instagram.com/sinotrukbolden_uae/" aria-label="Instagram" className="socialLink" target="_blank" rel="noopener noreferrer">
                          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                            <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                          </svg>
                        </Link>
                      </li>
                      <li>
                        <Link href="https://www.youtube.com/@Sinotrukuae" aria-label="YouTube" className="socialLink" target="_blank" rel="noopener noreferrer">
                          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                            <path fill="currentColor" d="M23 12s0-3-.4-4.4c-.2-.9-.9-1.6-1.8-1.8C18.4 5 12 5 12 5s-6.4 0-8.8.8c-.9.2-1.6.9-1.8 1.8C1 9 1 12 1 12s0 3 .4 4.4c.2.9.9 1.6 1.8 1.8C5.6 19 12 19 12 19s6.4 0 8.8-.8c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.4.4-4.4zM10 15V9l6 3-6 3z"/>
                          </svg>
                        </Link>
                      </li>
                      <li>
                        <Link href="https://www.linkedin.com/company/109429488" aria-label="LinkedIn" className="socialLink" target="_blank" rel="noopener noreferrer">
                          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                            <path fill="currentColor" d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3.5A2 2 0 1 0 5.26 7.5a2 2 0 0 0-.01-4zM20.44 20h-3.37v-6.25c0-1.49-.53-2.5-1.87-2.5a2.02 2.02 0 0 0-1.89 1.35c-.09.22-.12.52-.12.82V20h-3.37s.04-10.9 0-11.5h3.37v1.63c.45-.7 1.26-1.7 3.07-1.7 2.24 0 3.93 1.46 3.93 4.6V20z"/>
                          </svg>
                        </Link>
                      </li>
                  </ul>

              </div>

          </div>
          
        </div>
      </aside>

      {open && (
        <TestDriveModal
          onClose={() => setOpen(false)}
          modalImage="/assets/popup/book-test-drive-home.webp"
          carOptions={["Bolden Off-Road", "Bolden Passenger", "Bolden Commercial"]}
        />
      )}

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
          font-weight: 800; border-radius: 999px;
        }
        .ar { color: #fff; text-decoration: none; font-weight: 800; opacity: .9; }

        /* .railBtn {
          width: 42px; height: 42px; border-radius: 50%;
          border: 0; background: rgba(255,255,255,.95); color: #000;
          box-shadow: 0 10px 26px rgba(0,0,0,.18);
          cursor: pointer;
        } */

        .railBtn {
          width: 42px; height: 42px; border-radius: 50%;
          border: 0; background: rgba(255,255,255,0); color: #ffffff;
          cursor: pointer;
          font-size: 30px;
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
          z-index: 99;
        }
        .drawerClose:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 2px;
        }

        .drawerInner a {
          color: #fff; text-decoration: none; padding: 12px 6px; border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .mLinks {
          padding: 33px 0px;
          display: grid;
          gap: 24px;
          position: relative;
          text-align: center;
        }

        .mLinks a {
          color: #fff;
          text-transform: uppercase;
        }

        @media (max-width: 991px) {
          .nav { display: none; }
          .railBtn { display: none; }
          .hamburger { display: inline-block; }
          .drawer { display: block; }
          .bar {margin-top:0px;}
        }

        @media (max-width: 350px) {
          .cstHeadTest {
            padding-right: 10px;
            padding-left: 10px;
            font-size: 14px;
          }
        }

        
      `}</style>
    </header>
  );
}
