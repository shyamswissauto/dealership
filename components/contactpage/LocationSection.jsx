// components/location/LocationSection.jsx
"use client";

import styles from "./LocationSection.module.css";

export default function LocationSection({
  titleKicker = "Our Location",
  title = "Connecting Near and Far",
  org = "Snappy Inc.",
  tagline = "Chat Beyond Limits Together",
  cityLabel = "San Francisco, USA",
  street = "123 Tech Boulevard, Suite 456",
  cityLine = "San Francisco, CA 12345",
  country = "United States",
  mapsUrl = "https://maps.google.com/?q=Snappy+Inc,+San+Francisco",
  mapsEmbedSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.093312!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064b2e!2sSan%20Francisco!5e0!3m2!1sen!2sus!4v0000000000&q&z=13",
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
            <div className={styles.badge} aria-hidden>⚡</div>
            <div className={styles.cardBody}>
              <div className={styles.cardTitle}>{org}</div>
              <div className={styles.cardSub}>{tagline}</div>

              <div className={styles.cardPlace}>
                <strong>{cityLabel}</strong>
                <div className={styles.cardStreet}>{street}</div>
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
