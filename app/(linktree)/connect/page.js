// app/links/page.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  FaGlobe, FaWhatsapp, FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn, FaXTwitter,
} from "react-icons/fa6";
import { PiSteeringWheelBold } from "react-icons/pi";

/* ---------- Demo data ---------- */
const PROFILE = {
  handle: "@SinoTruk | Royal Swiss Auto Trading",
  title: "Car Dealer",
  subtitleAr: "وكالة بيع سيارات — جميع أنواع السيارات الجديدة",
  avatar: "/assets/sinotruk-logo-dark.png",
};

const LINKS = [
  { icon: PiSteeringWheelBold, label: "Book A Test Drive", href: "https://www.mysinotruk.ae/bolden-uae" },
  { icon: FaGlobe, label: "Website", href: "https://www.mysinotruk.ae/" },  
  { icon: FaWhatsapp, label: "WhatsApp", href: "https://wa.me/971561122500?text=Hi%2C%20Bolden%20UAE" },
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/sinotrukbolden_uae/" },
  { icon: FaFacebookF, label: "Facebook", href: "https://www.facebook.com/people/Sinotruk-UAE/61579914192315/" },
  { icon: FaYoutube, label: "YouTube", href: "https://www.youtube.com/@Sinotrukuae" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "https://www.linkedin.com/company/109429488" },
  { icon: FaXTwitter, label: "Twitter", href: "https://x.com/SinotrukUAE" },
];

const PRODUCTS = [
  {
    id: "p1",
    title: "Bolden Off-Road",
    img: "/assets/linktree/bolden-s9-hero-slider.webp",
    badge: "Listing",
    brochure: "/assets/brochure/bolden-off-road-brochure.pdf",
    spec: "/assets/brochure/bolden-off-road-spec.pdf",
  },
  {
    id: "p2",
    title: "Bolden Passenger",
    img: "/assets/linktree/bolden-heroslider.webp",
    badge: "Listing",
    brochure: "/assets/brochure/bolden-passenger-brochure.pdf",
    spec: "/assets/brochure/bolden-passenger-spec.pdf",
  },
  {
    id: "p3",
    title: "Bolden Commercial",
    img: "/assets/linktree/bolden-s6-hero-slider.webp",
    badge: "Listing",
    brochure: "/assets/brochure/bolden-commercial-brochure.pdf",
    spec: "/assets/brochure/bolden-commercial-spec.pdf",
  },
  // ...add the rest
];
/* -------------------------------- */

export default function LinktreePage() {
  const [tab, setTab] = useState("links");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return PRODUCTS;
    return PRODUCTS.filter((p) => p.title.toLowerCase().includes(t) || p.badge?.toLowerCase().includes(t));
  }, [q]);

  return (
    <main className="bg-body-tertiary min-vh-100 d-flex justify-content-center linkTreeClass">
      
      <div className="container px-3 px-md-0" style={{ maxWidth: 600 }}>

        <div className="rounded-4 bg-white shadow-sm my-4 p-3 p-md-4 position-relative">


          <div className="d-flex flex-column align-items-center text-center mt-2">
            <div className="overflow-hidden " style={{ maxWidth: 250}}>
              <img src={PROFILE.avatar} alt="Logo" style={{ width: '100%'}} />
            </div>
            <h1 className="h6 fw-bold mt-3 mb-1">{PROFILE.handle}</h1>
            <div className="text-muted small lh-sm">
              <div>{PROFILE.title}</div>
              {/* <div dir="rtl">{PROFILE.subtitleAr}</div> */}
            </div>

            <div className="d-inline-flex bg-body-tertiary rounded-pill mt-3 p-1 gap-1">
              <button
                type="button"
                className={`btn btn-sm rounded-pill ${tab === "links" ? "btn-dark" : "btn-light"}`}
                onClick={() => setTab("links")}
              >
                Links
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill ${tab === "shop" ? "btn-dark" : "btn-light"}`}
                onClick={() => setTab("shop")}
              >
                DOWNLOADS
              </button>
            </div>
          </div>

          <div className="mt-4">
            {tab === "links" ? <LinksList /> : <Shop q={q} setQ={setQ} items={filtered} />}
          </div>

          {/* <div className="text-center mt-4">
            <div className="text-muted small mt-2 d-flex justify-content-center gap-3">
              <Link href="#" className="link-secondary text-decoration-none">Terms of use</Link>
              <Link href="#" className="link-secondary text-decoration-none">Privacy Policy</Link>
            </div>
          </div> */}
        </div>
      </div>

      <style jsx>{`
        .product-card{border-radius:12px;overflow:hidden;border:0;box-shadow:0 4px 12px rgba(0,0,0,.06)}
        .product-cover{ position:relative; }
        .overlay{
          position:absolute; inset:0;
          display:flex; align-items:flex-end; justify-content:center; /* bottom-centered */
          background:linear-gradient(180deg,rgba(0,0,0,.10) 0%,rgba(0,0,0,.25) 45%,rgba(0,0,0,.55) 100%);
          padding:16px; transition:opacity .2s ease; opacity:1;
        }
        /* Fade-in on hover for devices that support hover */
        @media (hover:hover){
          .overlay{ opacity:0; }
          .product-cover:hover .overlay{ opacity:1; }
        }
        .overlay-inner{
          width:min(92%, 360px);         /* keep it centered & not too wide */
          display:flex; flex-direction:column; gap:8px;
        }
        .overlay .btn{ border-radius:999px; font-weight:600; }
        .overlay .btn-light{background:#fff;border:0}
        .badge-soft{position:absolute;top:8px;left:8px;background:#1664d3;color:#fff;border-radius:8px;padding:6px 10px;font-weight:600}
        .title-chip{
          position:absolute;top:8px;right:8px;background:rgba(0,0,0,.55);color:#fff;border-radius:8px;padding:6px 10px;
          font-weight:600;max-width:70%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis
        }
      `}</style>

      
    </main>
  );
}

function LinksList() {
  return (
    <div className="d-grid gap-3">
      {LINKS.map((l) => {
        const Icon = l.icon || FaGlobe;
        return (
          <Link
            key={l.label}
            href={l.href}
            target="_blank"
            className="link-pill text-decoration-none"
          >
            {/* left icon – absolutely positioned */}
            <span className="link-icon">
              <Icon size={22} />
            </span>

            {/* centered text */}
            <span className="link-label">{l.label}</span>
          </Link>
        );
      })}

      
    </div>
  );
}


function Shop({ q, setQ, items }) {
  return (
    <>
      {/* Search */}
      {/* <div className="input-group mb-3">
        <span className="input-group-text bg-white"><BiSearch /></span>
        <input
          type="search"
          className="form-control"
          placeholder="Search products"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div> */}

      <div className="row g-3">
        {items.map((p) => (
          <div className="col-12" key={p.id}>
            <div className="card product-card">
              {/* ratio removed — we handle size manually */}
              <div className="product-cover">
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  priority={false}
                  className="object-fit-cover"
                  sizes="(max-width:768px) 100vw, 700px"
                />

                {/* optional tags */}
                {/* {p.badge && <span className="badge-soft small">{p.badge}</span>} */}
                <span className="title-chip small">{p.title}</span>

                {/* overlay buttons */}
                <div className="overlay">
                  <div className="overlay-inner">
                    <Link href={p.brochure || "#"} className="btn btn-light btn-sm w-100" target="_blank">
                      Download Brochure
                    </Link>
                    <Link href={p.spec || "#"} className="btn btn-outline-light btn-sm w-100" target="_blank">
                      Download Specification
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .product-card {
          border-radius: 12px;
          overflow: hidden;
          border: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,.06);
        }
        .product-cover {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9; /* ensures consistent height */
          overflow: hidden;
        }
        .product-cover :global(img) {
          object-fit: cover;
        }

        .badge-soft {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #1664d3;
          color: #fff;
          border-radius: 8px;
          padding: 5px 10px;
          font-weight: 600;
          z-index: 2;
        }

        .title-chip {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,.55);
          color: #fff;
          border-radius: 8px;
          padding: 5px 10px;
          font-weight: 600;
          z-index: 2;
        }

        .overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,0.05) 0%,
            rgba(0,0,0,0.25) 50%,
            rgba(0,0,0,0.65) 100%
          );
          padding: 16px;
          opacity: 1;
          transition: opacity 0.25s ease;
          z-index: 1;
        }

        @media (hover:hover) {
          .overlay { opacity: 0; }
          .product-cover:hover .overlay { opacity: 1; }
        }

        .overlay-inner {
          width: min(92%, 360px);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .overlay .btn {
          border-radius: 999px;
          font-weight: 600;
        }

        .overlay .btn-light {
          background: #fff;
          border: 0;
        }
      `}</style>
    </>
  );
}

