"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import TestDriveModal from "@/components/ar/TestDriveModal";
import LanguageSwitcher from "../LanguageSwitcher";

// ====== MODEL DATA FOR MEGA MENU ======
const MODEL_GROUPS = [
  {
    id: "PICKUP",
    label: "بيك اب",
    models: [
      {
        name: "نوع أوف رود",
        href: "/ar/models/bolden-s9-off-road",
        image: "/assets/models/img2.webp",
      },
      {
        name: "باسنجر",
        href: "/ar/models/bolden-s7-passenger",
        image: "/assets/models/img3.webp",
      },
      {
        name: "كوميرشال",
        href: "/ar/models/bolden-s6-commercial",
        image: "/assets/models/img1.webp",
      },
    ],
  },
  /* {
    id: "passenger",
    label: "Passenger Cars",
    models: [],
  },
  {
    id: "sports",
    label: "Sports Cars",
    models: [],
  },
  {
    id: "commercial",
    label: "Commercial Vehicles",
    models: [],
  }, */
];

export default function HeaderNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef(null);

  // mega menu state (desktop)
  const [modelsOpen, setModelsOpen] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState(MODEL_GROUPS[0].id);

  // mobile models accordion
  const [modelsMobileOpen, setModelsMobileOpen] = useState(false);

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
    } else {
      // close mobile models accordion when drawer closes
      setModelsMobileOpen(false);
    }
  }, [mobileOpen]);

  // close mega menu on ESC
  useEffect(() => {
    if (!modelsOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setModelsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modelsOpen]);

  const activeGroup =
    MODEL_GROUPS.find((g) => g.id === activeGroupId) || MODEL_GROUPS[0];

  return (
    <header className="siteHeader reveal-up dirRtl">
      <div className="wrap bar">
        <Link href="/ar" className="logo">
          <img src="/assets/sinotruk-logo.png" alt="Sinotruk" width={180} />
        </Link>

        {/* ====== DESKTOP NAV ====== */}
        <nav className="nav">
          {/* MODELS with mega menu */}
          <div
            className={`navItem navItemModels ${
              modelsOpen ? "navItemOpen" : ""
            }`}
            onMouseEnter={() => setModelsOpen(true)}
            onMouseLeave={() => setModelsOpen(false)}
          >
            <a href="/ar/models"
              /* type="button" */
              className="navLink navLinkBtn cstTransY"
              aria-haspopup="true"
              aria-expanded={modelsOpen}
            >
              الموديلات
            </a>

            {/* MEGA PANEL – centered under the nav / header */}
            <div className="megaPanel" role="menu">
              <div className="megaInner">
                {/* Tabs */}
                <div className="megaTabs" role="tablist">
                  {MODEL_GROUPS.map((group) => (
                    <button
                      key={group.id}
                      type="button"
                      role="tab"
                      className={`megaTab ${
                        group.id === activeGroupId ? "megaTabActive" : ""
                      }`}
                      onClick={() => setActiveGroupId(group.id)}
                    >
                      {group.label}
                    </button>
                  ))}
                </div>

                {/* Models grid */}
                <div className="modelsGrid">
                  {activeGroup.models.length === 0 && (
                    <p className="megaEmpty">
                      Models coming soon for this category.
                    </p>
                  )}
                  {activeGroup.models.map((model) => (
                    <Link
                      key={model.href}
                      href={model.href}
                      className="modelCard"
                    >
                      <div className="modelImageWrap">
                        <img
                          src={model.image}
                          alt={model.name}
                          className="modelImage"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="modelName">{model.name}</h3>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* other links */}
          <Link href="/ar/special-offers" className="cstTransY navItemLinks">
            العروض الخاصة
          </Link>
          <Link href="/ar/bolden-business" className="cstTransY navItemLinks">
            بولدن للأعمال
          </Link>
         
          <Link href="/ar/contact-us" className="cstTransY navItemLinks">
            التواصل
          </Link>
        </nav>

        
        <div className="right">
          <LanguageSwitcher />
          <button
            onClick={() => setOpen(true)}
            className="cta btn cstBtnStyle hideMobile cstHeadTest"
          >
            تجربة القيادة
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

      {/* ====== MOBILE DRAWER ====== */}
      <div
        className={`scrim ${mobileOpen ? "show" : ""}`}
        onClick={() => setMobileOpen(false)}
      />
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
            {/* MOBILE MODELS ACCORDION */}
            <button
              type="button"
              className="mTrigger"
              onClick={() => setModelsMobileOpen((v) => !v)}
            >
              <span>الموديلات</span>
              <span
                className={`mTriggerIcon ${
                  modelsMobileOpen ? "mTriggerIconOpen" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {modelsMobileOpen && (
              <div className="mModels">
                {MODEL_GROUPS.map((group) => (
                  <div key={group.id} className="mGroup">
                    <p className="mGroupLabel">{group.label}</p>
                    <div className="mGroupModels">
                      {group.models.length === 0 && (
                        <span className="mEmpty">Coming soon</span>
                      )}
                      {group.models.map((model) => (
                        <Link
                          key={model.href}
                          href={model.href}
                          onClick={() => setMobileOpen(false)}
                          className="mModelLink"
                        >
                          {model.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* other mobile links */}
            <Link
              href="/ar/special-offers"
              onClick={() => setMobileOpen(false)}
            >
              العروض الخاصة
            </Link>
            <Link
              href="/ar/bolden-business"
              onClick={() => setMobileOpen(false)}
            >
              بولدن للأعمال
            </Link>
            <Link
              href="/ar/contact-us"
              onClick={() => setMobileOpen(false)}
            >
              التواصل
            </Link>

            <LanguageSwitcher />

            {/* your existing social icons block can stay here */}
          </div>
        </div>
      </aside>

      {open && (
        <TestDriveModal
          onClose={() => setOpen(false)}
          modalImage="/assets/popup/book-test-drive-home.webp"
          carOptions={[
            "Bolden Off-Road",
            "Bolden Passenger",
            "Bolden Commercial",
          ]}
        />
      )}

      <style jsx>{`
        .siteHeader {
          position: absolute;
          inset: 0 0 auto 0;
          z-index: 20;
          color: #fff;
        }

        .wrap {
          width: min(1500px, 92vw);
          margin: 0 auto;
        }

        .bar {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 24px;
          padding: 18px 0;
          margin-top: 40px;
        }

        .logo {
          color: #fff;
          text-decoration: none;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .nav {
          display: flex;
          justify-content: center;
          gap: clamp(14px, 2.2vw, 28px);
          position: relative; /* megaPanel is centered within this */
          padding-top: 15px;
        }

        .nav a {
          color: #fff;
          text-decoration: none;
          /* font-weight: 700; */
          opacity: 0.9;
        }
        .nav a:hover {
          opacity: 1;
        }

        .navItem {
          /* IMPORTANT: no position relative here, so megaPanel uses .nav */
        }

        .navLinkBtn {
          background: none;
          border: 0;
          padding: 0;
          cursor: pointer;
          font: inherit;
          color: inherit;
        }

        .right {
          display: flex;
          align-items: center;
          gap: 30px;
          justify-content: end;
        }

        .cta {
          text-decoration: none;
          font-weight: 800;
          border-radius: 999px;
        }

        /* ====== MEGA MENU (DESKTOP) ====== */
        .megaPanel {
          position: absolute;
          left: 50%;
          transform: translateX(-50%) translateY(12px); /* start slightly down */
          top: 100%;
          margin-top: 0px;
          width: min(900px, 92vw);
          background: #ffffff;
          color: #111827;
          border-radius: 18px;
          box-shadow: 0 28px 70px rgba(15, 23, 42, 0.25);
          padding: 22px 26px 26px;
          opacity: 0;                 /* hidden by default */
          visibility: hidden;
          pointer-events: none;
          transition:
            opacity 0.22s ease-out,
            transform 0.22s ease-out,
            visibility 0.22s ease-out;
          z-index: 40;
        }

        .navItemOpen .megaPanel {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0); /* slide up into place */
        }

        .megaInner {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .megaTabs {
          display: flex;
          gap: 24px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 10px;
        }

        .megaTab {
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
          padding: 4px 0;
          position: relative;
        }

        .megaTabActive {
          color: #111827;
        }

        .megaTabActive::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -9px;
          height: 2px;
          background: #111827;
          border-radius: 999px;
        }

        .modelsGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 26px 22px;
        }

        .modelCard {
          text-decoration: none;
          color: inherit;
          text-align: center;
          padding: 12px 8px 16px;
          border-radius: 14px;
          transition: transform 0.15s ease, box-shadow 0.15s ease,
            background 0.15s ease;
        }

        /* .modelCard:hover {
          transform: translateY(-4px);
          background: #f9fafb;
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
        }

        .modelCard:hover img.modelImage {
          transform: translateY(-4px);
          background: #f9fafb;
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
        } */

        .modelCard:hover .modelImage,
        .modelCard:focus-visible .modelImage {
          transform: scale(1.05);
        }

        .modelImageWrap {
          width: 100%;
          min-height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        }

        .modelImage {
          max-width: 100%;
          height: auto;
        }

        .modelName {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          margin: 4px 0 4px;
          color: #4b5563;
          text-align: center;
        }

        .modelPrice {
          font-size: 12px;
          color: #4b5563;
          margin: 0;
        }

        .megaEmpty {
          font-size: 13px;
          color: #6b7280;
        }

        .navItemModels {
          padding-bottom: 15px;
        }

    

        .cstTransY {
        
        }

        /* ====== MOBILE DRAWER ====== */
        .hamburger {
          display: none;
          width: 38px;
          height: 38px;
          border: 0;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          cursor: pointer;
          position: relative;
        }
        .hamburger span {
          position: absolute;
          left: 8px;
          right: 8px;
          height: 3px;
          background: #fff;
          transition: transform 0.3s, top 0.3s, opacity 0.2s;
          border-radius: 999px;
        }
        .hamburger span:nth-child(1) {
          top: 12px;
        }
        .hamburger span:nth-child(2) {
          top: 18px;
        }
        .hamburger span:nth-child(3) {
          top: 24px;
        }
        .hamburger.open span:nth-child(1) {
          top: 18px;
          transform: rotate(45deg);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          top: 18px;
          transform: rotate(-45deg);
        }

        .scrim {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          opacity: 0;
          pointer-events: none;
          transition: 0.2s;
          z-index: 19;
        }
        .scrim.show {
          opacity: 1;
          pointer-events: auto;
        }

        .drawer {
          position: fixed;
          inset: 0 0 0 auto;
          width: 76vw;
          max-width: 340px;
          background: #0f1114;
          color: #fff;
          translate: 100% 0;
          transition: translate 0.28s ease;
          z-index: 20;
          display: none;
        }

        .drawer.open {
          translate: 0 0;
        }

        .drawerInner {
          padding: 18px 18px 24px;
          display: grid;
          gap: 14px;
          position: relative;
        }

        .drawerClose {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 0;
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          z-index: 99;
        }

        .drawerInner a {
          color: #fff;
          text-decoration: none;
          padding: 12px 6px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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

        /* MOBILE MODELS ACCORDION */
        .mTrigger {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          border: 0;
          background: transparent;
          color: #fff;
          font-size: 14px;
          text-transform: uppercase;
          cursor: pointer;
        }

        .mTriggerIcon {
          transition: transform 0.2s ease;
        }
        .mTriggerIconOpen {
          transform: rotate(180deg);
        }

        .mModels {
          text-align: center;
        }

        .mGroup {
        }

        .mGroupLabel {
          font-size: 12px;
          text-transform: uppercase;
          opacity: 0.7;
          margin: 4px 0;
        }

        .mGroupModels {
          display: flex;
          flex-direction: column;
        }

        .mModelLink {
          padding: 6px 0;
          font-size: 14px;
          text-transform: none;
          border: 0;
        }

        .mEmpty {
          font-size: 12px;
          opacity: 0.7;
          padding: 4px 0 8px;
        }

        @media (max-width: 991px) {
          .nav {
            display: none;
          }
          .hamburger {
            display: inline-block;
          }
          .drawer {
            display: block;
          }
          .bar {
            margin-top: 0px;
          }
          /* hide mega panel on mobile */
          .megaPanel {
            display: none !important;
          }
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
