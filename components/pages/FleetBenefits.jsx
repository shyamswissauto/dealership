// app/components/FleetBenefits.jsx
"use client";

import Image from "next/image";
import styles from "./FleetBenefits.module.css";
import PromoGrid from "../modelList/PromoGrid";

export default function FleetBenefits({
  heading = `Whether you're running deliveries, managing crews, or powering up daily operations, Bolden pickups are built to keep your fleet moving — reliably, affordably, and with serious muscle. From rugged performance to smart features that make every drive smoother, Bolden is the partner your business deserves. Ready to scale up? Let’s get your fleet Bolden-ready.`,
  items = [
    {
      icon: "/assets/icons/settings.svg",
      title: "Built for Fleet Demands",
      text: "Bolden pickups are engineered for durability, load capacity, and all-day performance.",
    },
    {
      icon: "/assets/icons/settings.svg",
      title: "Business-Friendly Pricing",
      text: "Our fleet packages come with competitive rates and financing options that make scaling easy.",
    },
    {
      icon: "/assets/icons/settings.svg",
      title: "Easy Maintenance, Low Downtime",
      text: "Bolden’s accessible service networks and robust parts ensure your fleet stays on the road.",
    },
    {
      icon: "/assets/icons/settings.svg",
      title: "Customizable Configurations",
      text: "Choose from multiple trims and add-ons to match your fleet’s exact needs.",
    },
    {
      icon: "/assets/icons/settings.svg",
      title: "Fleet Management Support",
      text: "Optional telematics and GPS tracking tools help you monitor usage and reduce operational costs.",
    },
    {
      icon: "/assets/icons/settings.svg",
      title: "Dedicated Fleet Advisors",
      text: "Our team works with you directly to plan, quote, and deliver the right vehicles.",
    },
  ],
  ctaBand = "Fleet-Ready Pickups To Power Your Business Forward",
}) {
  return (
    <section className={styles.wrap} aria-labelledby="fleet-title">
      <div className={styles.container}>
        <h2 id="fleet-title" className={styles.heading}>
          {heading}
        </h2>

        <div className={styles.grid}>
          {items.map((it, i) => (
            <div className={styles.cell} key={i}>
              {it.icon && (
                <div className={styles.icon}>
                  {/* swap to <img> if you don’t use Next/Image */}
                  <Image
                    src={it.icon}
                    alt=""
                    width={56}
                    height={56}
                    priority={i < 3}
                  />
                </div>
              )}
              <h3 className={styles.title}>{it.title}</h3>
              <p className={styles.text}>{it.text}</p>
            </div>
          ))}
        </div>
      </div>

      <PromoGrid />

      <div className={styles.ctaBand}>
        <p className={styles.ctaText}>{ctaBand}</p>
      </div>
    </section>
  );
}
