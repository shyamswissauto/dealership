// components/location/LocationSection.jsx
"use client";

import styles from "./LocationSection.module.css";

export default function LocationSection({
  titleKicker = "Our Location",
  title = "Connecting Near and Far",
  org = "SINOTRUK",
  tagline = "Chat Beyond Limits Together",
  cityLabel = "Abu Dhabi, UAE",
  street = "C 178 Al Mahdar St, Industrial Area",
  cityLine = "Industrial City - ICAD V - Abu Dhabi",
  country = "United Arab Emirates",
  mapsUrl = "https://maps.app.goo.gl/jsgPAtieSeYP6cXg8",
  mapsEmbedSrc = "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3637.6447443636034!2d54.471344!3d24.254201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sen!2sae!4v1760961461887!5m2!1sen!2sae&z=13",
  /** Position of the pin in PERCENT of the map container (0–100) */
  pinX = 42, // left %
  pinY = 58, // top  %
}) {
  return (
    <section className={styles.wrap} aria-labelledby="loc-title">
      <div className={styles.grid}>
        {/* LEFT: Map */}
        <div
          className={styles.mapWrap}
          style={{ ["--pin-x"]: `${pinX}%`, ["--pin-y"]: `${pinY}%` }}
        >
          <iframe
            title="Map"
            src={mapsEmbedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={styles.map}
            /* Disable all interactions: no drag/scroll/click */
            style={{ pointerEvents: "none" }}
          />

          {/* Pulse dot (locked to pin location) */}
          <div className={styles.pulse} aria-hidden />

          {/* Floating info card (locked to pin, arrow centered to pulse) */}
          <div className={styles.pinCard}>
            {/* <div className={styles.badge} aria-hidden>⚡</div> */}
            <div className={styles.cardBody}>
              <div className={styles.cardTitle}>{org}</div>
              {/* <div className={styles.cardSub}>{tagline}</div> */}

              <div className={styles.cardPlace}>
                {/* <strong>{cityLabel}</strong> */}
                <div className={styles.cardStreet}>{street}</div>
                <div className={styles.cardStreet}>{cityLabel}</div>
              </div>

              <a className={styles.cardLink} href={mapsUrl} target="_blank" rel="noreferrer">
                Open Google Maps <span className={styles.chev}>▾</span>
              </a>
            </div>
            {/* the little triangle that points exactly to the pulse */}
            <div className={styles.pointer} aria-hidden />
          </div>
        </div>

        {/* RIGHT: Copy */}
        <div className={styles.copy}>
          <div className={styles.kicker}>{titleKicker}</div>
          <h2 id="loc-title" className={styles.title}>{title}</h2>

          <h3 className={styles.h3}>Headquarters</h3>
          <div className={styles.addr}>
            <div>{org}</div>
            <div>{cityLabel}</div>
            <div>{street}</div>
            <div>{cityLine}</div>
            <div>{country}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
