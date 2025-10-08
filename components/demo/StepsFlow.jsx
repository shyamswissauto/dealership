"use client";

import s from "./StepsFlow.module.css";

export default function StepsFlow() {
  return (
    <section className={s.wrap}>
      <div className={s.grid}>
        {/* Title column */}
        <header className={s.titleCol}>
          <p className={s.kicker}>SIMPLE STEPS</p>
          <h2 className={s.title}>
            TO SECURE
            <br />
            SMART CAPITAL
          </h2>
        </header>

        {/* 01 – full orange */}
        <figure className={`${s.card} ${s.orange}`} style={{ gridArea: "cp" }}>
          {/* image */}
          <img src="/step1img.webp" alt="Create Profile" className={s.media} />
          {/* overlay */}
          <figcaption className={s.overlay}>
            <div className={s.textRight}>
              <h3 className={s.h}>Create Profile</h3>
              <p className={s.p}>
                Set up your startup profile with key details investors want to see.
              </p>
            </div>
            <span className={`${s.bigNum} ${s.numLight}`}>01</span>
          </figcaption>
          {/* dots */}
          <span className={`${s.dot} ${s.dotLeft}`} aria-hidden="true" />
          <span className={`${s.dot} ${s.dotRight}`} aria-hidden="true" />
        </figure>

        {/* 03 – left grey */}
        <figure className={`${s.card} ${s.grey}`} style={{ gridArea: "sp" }}>
          <img src="/step2img.webp" alt="Submit Pitch" className={s.media} />
          <figcaption className={s.overlay}>
            <div className={s.textRight}>
              <h3 className={s.h}>Submit Pitch</h3>
              <p className={s.p}>
                Our smart algorithm helps you find VCs and angel investors aligned with
                your industry, stage, and goals.
              </p>
            </div>
            <span className={`${s.bigNum} ${s.numDark}`}>03</span>
          </figcaption>
          <span className={`${s.dot} ${s.dotRight}`} aria-hidden="true" />
        </figure>

        {/* 02 – right grey */}
        <figure className={`${s.card} ${s.grey}`} style={{ gridArea: "gm" }}>
          <img src="/step3img.webp" alt="Get Matched" className={s.media} />
          <figcaption className={s.overlay}>
            <div className={s.textRight}>
              <h3 className={s.h}>Get Matched</h3>
              <p className={s.p}>
                Upload your pitch deck and showcase your vision, traction, and
                potential to serious investors.
              </p>
            </div>
            <span className={`${s.bigNum} ${s.numDark}`}>02</span>
          </figcaption>
          <span className={`${s.dot} ${s.dotLeft}`} aria-hidden="true" />
        </figure>

        {/* 04 – full orange */}
        <figure className={`${s.card} ${s.orange}`} style={{ gridArea: "sf" }}>
          <img src="/step4img.webp" alt="Secure Funds" className={s.media} />
          <figcaption className={s.overlay}>
            <div className={s.textRight}>
              <h3 className={s.h}>Secure Funds</h3>
              <p className={s.p}>
                Engage with interested backers, negotiate terms, and close your
                funding round with confidence.
              </p>
            </div>
            <span className={`${s.bigNum} ${s.numLight}`}>04</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
