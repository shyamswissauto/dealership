// app/components/ExperienceSection.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./ExperienceSection.module.css";
import TestDriveModal from "@/components/TestDriveModal";

export default function ExperienceSection({
  eyebrow = "The Sinotruk Bolden is built for UAE roads. Curious about how it performs? Take it for a spin.",
  titleTop = "From city streets to desert trails— the Bolden pickup is ready to take on any terrain. Are you?",
  titleBottom = "",
  body = `This is your opportunity to lay your hands on a pickup truck that works as hard as you do. Whether you're navigating deliveries in Dubai or powering through desert terrain in Al Ain, Sinotruk Bolden is built to handle it all. By test driving it, you’re not merely assessing the specs; you’ll also get the chance to feel its torque firsthand. Besides, you’ll also get to experience what true comfort in a pickup feels like. From smooth handling to rugged reliability, this is where performance meets practicality.
Ready to test drive the Sinotruk Bolden? We have a simple booking process. Once you’ve booked your slot, head to our test drive center, and our team will walk you through every feature, answer your questions, and make sure you get a feel for what the Bolden can do. No pressure to buy—just a chance to see if it’s the right fit for you. Because when it comes to your vehicle, we firmly believe that the best way to experience a vehicle’s features is behind the wheel.
`,
  ctaLabel = "Book A Test Drive",
}) {

  const [open, setOpen] = useState(false);

  return (
    <>
    <section className={styles.wrap} aria-labelledby="exp-title-top">
      <div className={styles.container}>
        <h1 className={styles.title}>
          <span id="exp-title-top">{titleTop}</span>
          <br />
          <span className={styles.titleEmphasis}>{titleBottom}</span>
        </h1>

        <p className={styles.eyebrow}>{eyebrow}</p>

        <div className={styles.copy}>
          {body.split("\n").map((p, i) => (
            <p key={i}>{p.trim()}</p>
          ))}
        </div>

        

        <button onClick={() => setOpen(true)} className={styles.cta}>{ctaLabel}</button>
      </div>
    </section>
        {open && (
            <TestDriveModal
              onClose={() => setOpen(false)}
              modalImage="/assets/popup/book-test-drive-home.webp"
              carOptions={["Bolden Off-Road", "Bolden Passenger", "Bolden Commercial"]}
            />
          )}
    </>
  );
}
