"use client";

import { useMemo, useState } from "react";
import styles from "./EmiCalculator.module.css";

const AED = (n) =>
  new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(
    isFinite(n) ? n : 0
  );

/** EMI = P*r*(1+r)^n / ((1+r)^n - 1), r = monthly rate, n = months  */
const computeEmi = (principal, annualRatePct, years) => {
  const n = Math.max(1, Math.round(years * 12));
  const r = (annualRatePct / 12) / 100;
  if (r === 0) {
    const emi = principal / n;
    return { emi, totalPayment: emi * n, totalInterest: emi * n - principal };
  }
  const pow = Math.pow(1 + r, n);
  const emi = (principal * r * pow) / (pow - 1);
  return { emi, totalPayment: emi * n, totalInterest: emi * n - principal };
};

export default function EmiCalculator({
  // sensible defaults; adjust to your product
  minAmount = 10000,
  maxAmount = 500000,
  minRate = 1,
  maxRate = 15,
  minYears = 1,
  maxYears = 7,
  initial = { amount: 180000, rate: 6.5, years: 4 },
  title = "EMI CALCULATOR",
}) {
  const [amount, setAmount] = useState(initial.amount);
  const [rate, setRate] = useState(initial.rate);
  const [years, setYears] = useState(initial.years);

  const { emi, totalPayment, totalInterest } = useMemo(
    () => computeEmi(amount, rate, years),
    [amount, rate, years]
  );

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const toNum = (e) => Number(String(e.target.value).replace(/[^\d.]/g, "") || 0);

  return (
    <section className={styles.wrap} aria-labelledby="emi-title">
      <div className={styles.container}>
        <h2 id="emi-title" className={styles.title}>{title}</h2>

        {/* Frosted card */}
        <div className={styles.glass}>
          {/* amount */}
          <div className={styles.row}>
            <label className={styles.label} htmlFor="amt">Loan amount</label>            
            <input
              className={styles.box}
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(clamp(toNum(e), minAmount, maxAmount))}
            />
            <input
              id="amt"
              type="range"
              min={minAmount}
              max={maxAmount}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className={styles.range}
            />
          </div>

          {/* rate */}
          <div className={styles.row}>
            <label className={styles.label} htmlFor="rate">Rate of Interest %</label>
            <input
              id="rate"
              type="range"
              min={minRate}
              max={maxRate}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className={styles.range}
            />
            <input
              className={styles.box}
              inputMode="decimal"
              value={rate}
              onChange={(e) => setRate(clamp(toNum(e), minRate, maxRate))}
            />
          </div>

          {/* tenure */}
          <div className={styles.row}>
            <label className={styles.label} htmlFor="yrs">Loan Tenure (Years)</label>
            <input
              id="yrs"
              type="range"
              min={minYears}
              max={maxYears}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className={styles.range}
            />
            <input
              className={styles.box}
              inputMode="numeric"
              value={years}
              onChange={(e) => setYears(clamp(toNum(e), minYears, maxYears))}
            />
          </div>
        </div>

        {/* Results */}
        <div className={styles.results}>
          <ResultCard label="Monthly EMI" value={AED(emi)} />
          <ResultCard label="Principal Amount" value={AED(amount)} />
          <ResultCard label="Total Interest" value={AED(totalInterest)} />
          <ResultCard label="Total Amount" value={AED(totalPayment)} />
        </div>
      </div>
    </section>
  );
}

function ResultCard({ label, value }) {
  return (
    <div className={styles.card} role="group" aria-label={label}>
      <div className={styles.cardLabel}>{label}</div>
      <div className={styles.cardValue}>{value}</div>
    </div>
  );
}
