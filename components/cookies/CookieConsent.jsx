"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./CookieConsent.module.css";

const COOKIE_NAME = "cookie_consent"; // values: "accepted" | "rejected"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year (seconds)

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

function setCookie(name, value, maxAgeSeconds) {
  if (typeof document === "undefined") return;
  const secure = typeof window !== "undefined" && window.location?.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

export default function CookieConsent({
  privacyHref = "/privacy-policy",
  manageHref  = "/cookie-settings", // optional, can be same as privacy
  text = "We use cookies to improve your experience, analyze traffic, and for advertising.",
  acceptText = "Accept",
  rejectText = "Only necessary",
  learnMoreText = "Learn more",
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const v = getCookie(COOKIE_NAME);
    setVisible(v !== "accepted" && v !== "rejected");
  }, []);

  const accept = () => {
    setCookie(COOKIE_NAME, "accepted", COOKIE_MAX_AGE);
    setVisible(false);
  };

  const reject = () => {
    setCookie(COOKIE_NAME, "rejected", COOKIE_MAX_AGE);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={styles.wrap}
      role="dialog"
      aria-live="polite"
      aria-modal="false"
      aria-label="Cookie consent"
    >
      <div className={styles.inner}>
        <p className={styles.msg}>
          {text}{" "}
          <Link href={privacyHref} className={styles.link}>{learnMoreText}</Link>
          {manageHref && manageHref !== privacyHref ? (
            <>
              {/* {" "}|{" "}
              <Link href={manageHref} className={styles.link}>Manage</Link> */}
            </>
          ) : null}
        </p>

        <div className={styles.actions}>
          {/* <button className={`${styles.btn} ${styles.ghost}`} onClick={reject}>
            {rejectText}
          </button> */}
          <button className={styles.btn} onClick={accept}>
            {acceptText}
          </button>
        </div>
      </div>
    </div>
  );
}
