"use client";

import { useMemo, useState } from "react";
import styles from "./EmiCalculator.module.css";

/* const AED = (n) =>
    new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" })
        .format(isFinite(n) ? n : 0); */

const AED0_FMT = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const AED0 = (n) => AED0_FMT.format(Math.round(isFinite(n) ? n : 0));

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
    minAmount = 10000,
    maxAmount = 500000,
    minRate = 0,
    maxRate = 15,
    minYears = 1,
    maxYears = 7,
    initial = { amount: 60000, rate: 6.5, years: 4 },
    title = "CALCULATE YOUR EMI",
}) {
    const [amount, setAmount] = useState(initial.amount);
    const [rate, setRate] = useState(initial.rate);
    const [years, setYears] = useState(initial.years);

    const { emi, totalPayment, totalInterest } = useMemo(
        () => computeEmi(amount, rate, years),
        [amount, rate, years]
    );

    // helpers
    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
    const toNum = (e) => Number(String(e.target.value).replace(/[^\d.]/g, "") || 0);
    const pct = (value, min, max) => ((value - min) / (max - min)) * 100;

    return (
        <section className={styles.wrap} aria-labelledby="emi-title">

            <h2 id="emi-title" className={styles.title}>{title}</h2>

            <div className={styles.containerBg}>

            

                    <div className={styles.container}>




                        {/* Glass panel */}
                        <div className={styles.glass}>
                            {/* AMOUNT */}
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
                                    style={{ "--p": `${pct(amount, minAmount, maxAmount)}%` }}
                                />
                            </div>

                            {/* RATE */}
                            <div className={styles.row}>
                                <label className={styles.label} htmlFor="rate">Rate of Interest %</label>
                                <input
                                    className={styles.box}
                                    inputMode="decimal"
                                    value={rate}
                                    onChange={(e) => setRate(clamp(toNum(e), minRate, maxRate))}
                                />
                                <input
                                    id="rate"
                                    type="range"
                                    min={minRate}
                                    max={maxRate}
                                    step={0.1}
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                    className={styles.range}
                                    style={{ "--p": `${pct(rate, minRate, maxRate)}%` }}
                                />
                            </div>

                            {/* TENURE */}
                            <div className={styles.row}>
                                <label className={styles.label} htmlFor="yrs">Loan Tenure (Years)</label>
                                <input
                                    className={styles.box}
                                    inputMode="numeric"
                                    value={years}
                                    onChange={(e) => setYears(clamp(toNum(e), minYears, maxYears))}
                                />
                                <input
                                    id="yrs"
                                    type="range"
                                    min={minYears}
                                    max={maxYears}
                                    step={1}
                                    value={years}
                                    onChange={(e) => setYears(Number(e.target.value))}
                                    className={styles.range}
                                    style={{ "--p": `${pct(years, minYears, maxYears)}%` }}
                                />
                            </div>
                        </div>

                        {/* Results */}
                        <div className={styles.results}>
                            <ResultCard label="Monthly EMI" value={AED0(emi)} />
                            <ResultCard label="Principal Amount" value={AED0(amount)} />
                            <ResultCard label="Total Interest" value={AED0(totalInterest)} />
                            <ResultCard label="Total Amount" value={AED0(totalPayment)} />
                        </div>
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
