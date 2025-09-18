"use client";

import Image from "next/image";
import styles from "./TestDriveSection.module.css";

const DEFAULT_LEFT  = "/assets/home/book-test-drive1.webp";
const DEFAULT_RIGHT = "/assets/home/book-test-drive2.webp";

const CAR_OPTIONS = ["Okavango", "Starray", "Coolray", "Emgrand"];

export default function TestDriveSection({
  title = "BOOK A TEST DRIVE",
  leftSrc = DEFAULT_LEFT,
  rightSrc = DEFAULT_RIGHT,
  cars = CAR_OPTIONS,
}) {
  return (
    <section className={styles.wrap} aria-labelledby="td-title">
      <div className={styles.grid}>
        
        <figure className={`${styles.panel} ${styles.left}`}>
          <Image
            src={leftSrc}
            alt=""
            fill
            sizes="(max-width: 991px) 100vw, 40vw"
            className={styles.bg}
            priority={false}
          />
        </figure>

        
        <div className={styles.formPanel}>
          <h2 id="td-title" className={styles.title}>{title}</h2>

          <form
                className={styles.form}
                onSubmit={(e) => {
                    e.preventDefault();
                    // API
                }}
                >
                <div className={styles.field}>
                    <input type="text" className={styles.input} placeholder="Full Name" required />
                </div>

                <div className={styles.field}>
                    <input type="email" className={styles.input} placeholder="Your email" required />
                </div>

                <div className={styles.field}>
                    <input
                    type="tel"
                    className={styles.input}
                    placeholder="Phone Number"
                    inputMode="tel"
                    pattern="[0-9+() -]*"
                    required
                    />
                </div>

                <div className={styles.field}>
                    <select
                    className={`${styles.input} ${styles.select}`}
                    name="car"
                    required
                    defaultValue=""             
                    >
                    <option value="" disabled hidden>Select your car</option>
                    {cars.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                    </select>
                </div>

                <button className={styles.btn} type="submit">BOOK NOW</button>
                </form>


        </div>

        
        <figure className={`${styles.panel} ${styles.right}`}>
          <Image
            src={rightSrc}
            alt=""
            fill
            sizes="(max-width: 991px) 100vw, 40vw"
            className={styles.bg}
            priority={false}
          />
        </figure>
      </div>
    </section>
  );
}
