"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";
import StickyActions from "@/components/ui/StickyActions";

export default function Footer() {
  return (
    <footer className={styles.wrap} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.top}>
          
          <div className={styles.brand}>
            <img
              src="/assets/logo.png"   
              alt="VGV"
              width={180}
              className={styles.logo}
            />
            <p className={styles.blurb}>
              Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed diam nonummy nibh euismod
              tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi
              enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit
            </p>
          </div>

          
          <nav aria-labelledby="foot-product" className={styles.col}>
            <h3 id="foot-product" className={styles.heading}>MODELS</h3>
            <ul className={styles.list}>
              <li><Link href="#">U75PLUS</Link></li>
              <li><Link href="#">U70PRO</Link></li>
              <li><Link href="#">OFF ROAD TYPE</Link></li>
              <li><Link href="#">PASSENGER</Link></li>
              <li><Link href="#">COMMERCIAL</Link></li>
            </ul>
          </nav>

          
          <nav aria-labelledby="foot-links" className={styles.col}>
            <h3 id="foot-links" className={styles.heading}>USEFUL LINKS</h3>
            <ul className={styles.list}>
              <li><Link href="#">Lorem ipsum</Link></li>
              <li><Link href="#">Lorem ipsum</Link></li>
              <li><Link href="#">Lorem ipsum</Link></li>
              <li><Link href="#">Lorem ipsum</Link></li>
              <li><Link href="#">Lorem ipsum</Link></li>
            </ul>
          </nav>

          
          <div className={styles.col}>
            <h3 className={styles.heading}>CONTACT</h3>
            <ul className={styles.contactList}>
              <li>Dubai, UAE</li>
              <li><a href="mailto:info@">Info@</a></li>
              <li><a href="tel:80000000">800 000 00</a></li>
              <li><a href="tel:+971000000000">971 00 000 000</a></li>
            </ul>
          </div>
        </div>

        
        <div className={styles.socialRow}>
          <p className={styles.socialTitle}>Get Connected with us on social networks</p>
          <ul className={styles.socials} aria-label="Social media">
            <li>
              <Link href="#" aria-label="Facebook" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path fill="currentColor" d="M13 10h3l-1 4h-2v7h-4v-7H7v-4h2V8a4 4 0 0 1 4-4h3v4h-3a1 1 0 0 0-1 1v1z"/>
                </svg>
              </Link>
            </li>
            <li>
              <Link href="#" aria-label="X" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path fill="currentColor" d="M3 4l8.1 9.7L3.7 20H6l6.2-5.5L17.6 20H21l-8.5-10L20.3 4H18L12.2 9.1 8.1 4z"/>
                </svg>
              </Link>
            </li>
            <li>
              <Link href="#" aria-label="Instagram" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                </svg>
              </Link>
            </li>
            <li>
              <Link href="#" aria-label="YouTube" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path fill="currentColor" d="M23 12s0-3-.4-4.4c-.2-.9-.9-1.6-1.8-1.8C18.4 5 12 5 12 5s-6.4 0-8.8.8c-.9.2-1.6.9-1.8 1.8C1 9 1 12 1 12s0 3 .4 4.4c.2.9.9 1.6 1.8 1.8C5.6 19 12 19 12 19s6.4 0 8.8-.8c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.4.4-4.4zM10 15V9l6 3-6 3z"/>
                </svg>
              </Link>
            </li>
            <li>
              <Link href="#" aria-label="LinkedIn" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path fill="currentColor" d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3.5A2 2 0 1 0 5.26 7.5a2 2 0 0 0-.01-4zM20.44 20h-3.37v-6.25c0-1.49-.53-2.5-1.87-2.5a2.02 2.02 0 0 0-1.89 1.35c-.09.22-.12.52-.12.82V20h-3.37s.04-10.9 0-11.5h3.37v1.63c.45-.7 1.26-1.7 3.07-1.7 2.24 0 3.93 1.46 3.93 4.6V20z"/>
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      
      <div className={styles.legal}>
        <div className={styles.container}>
          <p>© 2025 SINOTRUCK. ALL RIGHTS RESERVED.</p>
        </div>
      </div>

      <StickyActions />
      
    </footer>
  );
}
