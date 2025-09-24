"use client";

import { useMemo, useRef, useState } from "react";
import styles from "./RequestQuote.module.css";

const CATEGORIES = ["ALL", "SEDAN", "SUV"];

const MODELS = [
  { id: "u75plus", name: "U75PLUS", body: "SUV", category: "SUV", img: "/assets/models/img4.webp" },
  { id: "u70pro", name: "U70PRO", body: "SUV", category: "SUV", img: "/assets/models/img5.webp" },
  { id: "bolden-off-road",     name: "BOLDEN OFF-ROAD", body: "PICKUP", category: "PICKUP", img: "/assets/models/img2.webp" },
  { id: "bolden-passenger", name: "BOLDEN PASSENGER", body: "PICKUP", category: "PICKUP", img: "/assets/models/img3.webp" },
  { id: "bolden-commercial",  name: "BOLDEN COMMERCIAL", body: "PICKUP", category: "PICKUP", img: "/assets/models/img1.webp" },
];

const TITLES = ["Mr.", "Ms.", "Mrs."];
const LOCATIONS = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Umm Al Quwain", "Fujairah"];

export default function RequestQuote() {
  const [cat, setCat] = useState("ALL");
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState("");
  const [selectedId, setSelectedId] = useState(MODELS[0].id);
  const [agree, setAgree] = useState(false);

  const scrollerRef = useRef(null);

  const visibleModels = useMemo(
    () => (cat === "ALL" ? MODELS : MODELS.filter(m => m.category === cat)),
    [cat]
  );

  // Scroll helpers
  const scrollByAmount = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.8) * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");
    setSubmitting(true);

    const formEl = e.currentTarget;

    try {
        const form = new FormData(formEl);
        const payload = Object.fromEntries(form.entries());

        const m = MODELS.find(x => x.id === selectedId) || {};
        const body = { ...payload, modelId: selectedId, modelName: m.name, modelBody: m.body, modelCategory: m.category };

        const res = await fetch("/api/request-quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });


        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error || "Failed");

        setServerMsg(`Thanks! Reference: ${json.ref}`);
        formEl.reset();
        setAgree(false);
    } catch (err) {
        setServerMsg(err.message || "Something went wrong");
    } finally {
        setSubmitting(false);
    }
    };


  const selectedModel = MODELS.find(m => m.id === selectedId);

  return (
    <section className={styles.wrap} aria-labelledby="rq-title">
      {/* STEP 1 */}
      {/* <div className={styles.row}>
        <aside className={styles.step}><span>STEP</span><b>1</b></aside>

        <div className={styles.content}>
          <h2 id="rq-title" className={styles.title}>CHOOSE YOUR CAR</h2>

          <div className={styles.chips} role="tablist" aria-label="Filter by body type">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                className={`${styles.chip} ${cat === c ? styles.chipActive : ""}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div> */}

      {/* STEP 2 */}
      <div className={styles.row}>
        

        <div className={styles.content}>
          <h3 className={styles.subtitle}>SELECT MODEL</h3>

          <div className={styles.modelWrap}>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowLeft}`}
              aria-label="Scroll models left"
              onClick={() => scrollByAmount("left")}
            >
              ‹
            </button>

            <ul ref={scrollerRef} className={styles.scroller} tabIndex={0}>
              {visibleModels.map((m) => (
                <li key={m.id} className={styles.card}>
                  <button
                    type="button"
                    className={`${styles.cardBtn} ${selectedId === m.id ? styles.cardSelected : ""}`}
                    onClick={() => setSelectedId(m.id)}
                    aria-pressed={selectedId === m.id}
                  >
                    <figure className={styles.cardMedia}>
                      <img src={m.img} alt={`${m.name} image`} loading="lazy" />
                    </figure>
                    <figcaption className={styles.cardText}>
                      <strong className={styles.cardName}>{m.name}</strong>
                     {/*  <small className={styles.cardMeta}>Body Type : {m.body}</small> */}
                    </figcaption>
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowRight}`}
              aria-label="Scroll models right"
              onClick={() => scrollByAmount("right")}
            >
              ›
            </button>
          </div>

          {/* STEP 3 — FORM */}
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <input type="hidden" name="modelId" value={selectedId} />

            {/* Title */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="rq-title-select">Title <span>*</span></label>
              <div className={styles.selectWrap}>
                <select id="rq-title-select" name="title" className={`${styles.input} ${styles.select}`} required defaultValue="">
                  <option value="" disabled hidden>Select Title</option>
                  {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Name */}
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="firstName">First Name <span>*</span></label>
                <input id="firstName" name="firstName" className={styles.input} required />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="lastName">Last Name <span>*</span></label>
                <input id="lastName" name="lastName" className={styles.input} required />
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                  <label className={styles.label} htmlFor="phone">Phone <span>*</span></label>
                  <input
                    id="phone"
                    name="phone"
                    className={styles.input}
                    inputMode="tel"
                    pattern="[0-9]{5,15}"
                    placeholder="Phone"
                    required
                  />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">Email <span>*</span></label>
                <input id="email" name="email" type="email" className={styles.input} required />
              </div>
            </div>

            {/* Location */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="location">Select the location <span>*</span></label>
              <div className={styles.selectWrap}>
                <select id="location" name="location" className={`${styles.input} ${styles.select}`} defaultValue="" required>
                  <option value="" disabled hidden>Select Location</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Comments */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="comments">Comments</label>
              <textarea id="comments" name="comments" className={`${styles.input} ${styles.textarea}`} rows={5} />
            </div>

            {/* Terms */}
            <label className={styles.terms}>
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
              <span>I have read and accept <a href="#" target="_blank" rel="noreferrer">Terms &amp; Conditions</a></span>
            </label>

            <button type="submit" className={styles.submit} disabled={!agree || submitting}>
                {submitting ? "Submitting..." : "Submit"}
            </button>

            {serverMsg && <p style={{marginTop:8}}>{serverMsg}</p>}

          </form>
        </div>
      </div>
    </section>
  );
}
