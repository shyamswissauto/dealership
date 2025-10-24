"use client";

import { useMemo, useState } from "react";
import styles from "./EmiCalculator1.module.css";

/** 👉 Configure your models here */
const CAR_MODELS = [
    { id: "base", name: "Select a model", price: 0 },
    { id: "carrera", name: "Bolden Off-Road", price: 419999 },
    { id: "macan", name: "Bolden Passenger", price: 289999 },
    { id: "cayenne", name: "Bolden Commercial", price: 369999 },
];

const LOAN_YEARS = [1, 2, 3, 4, 5];

export default function EmiCalculator1() {
    // state
    const [modelId, setModelId] = useState(CAR_MODELS[1].id); // default 1st real model
    const modelPrice = useMemo(
        () => (CAR_MODELS.find(m => m.id === modelId) || CAR_MODELS[0]).price,
        [modelId]
    );

    const [carPrice, setCarPrice] = useState(modelPrice || 314999);
    const [downPct, setDownPct] = useState(20);
    const [interest, setInterest] = useState(2.79);
    const [years, setYears] = useState(5);

    // keep price in sync when model changes
    if (carPrice !== modelPrice && modelPrice > 0) {
        // set once on first render after change
        setCarPrice(modelPrice);
    }

    const downAmt = useMemo(
        () => Math.round((downPct / 100) * carPrice),
        [downPct, carPrice]
    );

    const principal = useMemo(
        () => Math.max(carPrice - downAmt, 0),
        [carPrice, downAmt]
    );

    const { monthly, totalInterest } = useMemo(() => {
        const r = interest / 12 / 100; // monthly interest rate
        const n = years * 12;
        if (r === 0) {
            const m = principal / n;
            return { monthly: m, totalInterest: 0 };
        }
        const m = (principal * r) / (1 - Math.pow(1 + r, -n));
        const ti = m * n - principal;
        return { monthly: m, totalInterest: ti };
    }, [principal, interest, years]);

    // helpers
    const fmt = (n) =>
        new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(
            Math.round(n || 0)
        );

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    return (
        <section className={styles.wrap}>

            <div className={styles.containerBg}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h2>Car Finance Calculator</h2>
                    </div>

                    <div className={styles.glass}>

                    <div className={styles.grid}>
                        {/* === LEFT: Controls === */}
                        <div className={styles.controls}>

                            {/* Car Model */}
                            <div className={styles.block}>
                                <label className={styles.lbl}>Car Model</label>
                                <div className={styles.selectWrap}>
                                    <select
                                        className={styles.select}
                                        value={modelId}
                                        onChange={(e) => setModelId(e.target.value)}
                                    >
                                        {CAR_MODELS.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.name} {m.price ? `— AED ${fmt(m.price)}` : ""}
                                            </option>
                                        ))}
                                    </select>
                                    <svg className={styles.caret} viewBox="0 0 24 24" aria-hidden>
                                        <path
                                            d="M6 9l6 6 6-6"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Car Price */}
                            <div className={styles.block}>
                                <label className={styles.lbl}>Car Price</label>
                                <div className={styles.inlineField}>
                                    <span className={styles.prefix}>AED</span>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        value={carPrice}
                                        min={10000}
                                        step={500}
                                        onChange={(e) =>
                                            setCarPrice(clamp(parseInt(e.target.value || 0, 10), 10000, 2000000))
                                        }
                                    />
                                </div>
                                <input
                                    type="range"
                                    className={styles.slider}
                                    min="10000"
                                    max="2000000"
                                    step="500"
                                    value={carPrice}
                                    onChange={(e) => setCarPrice(parseInt(e.target.value, 10))}
                                />
                            </div>

                            {/* Down Payment (amount + %) */}
                            <div className={styles.block}>
                                <label className={styles.lbl}>Down Payment</label>
                                <div className={styles.twoCols}>
                                    <div className={styles.inlineField}>
                                        <span className={styles.prefix}>AED</span>
                                        <input
                                            type="number"
                                            className={styles.input}
                                            value={downAmt}
                                            min={0}
                                            step={1000}
                                            onChange={(e) => {
                                                const amt = clamp(parseInt(e.target.value || 0, 10), 0, carPrice);
                                                setDownPct(Math.min(100, (amt / carPrice) * 100));
                                            }}
                                        />
                                    </div>
                                    <div className={styles.inlineField}>
                                        <input
                                            type="number"
                                            className={styles.input}
                                            value={Number(downPct.toFixed(0))}
                                            min={0}
                                            max={100}
                                            step={1}
                                            onChange={(e) =>
                                                setDownPct(clamp(parseFloat(e.target.value || 0), 0, 100))
                                            }
                                        />
                                        <span className={styles.suffix}>%</span>
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    className={styles.slider}
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={downPct}
                                    onChange={(e) => setDownPct(parseFloat(e.target.value))}
                                />
                            </div>

                            {/* Interest */}
                            <div className={styles.block}>
                                <label className={styles.lbl}>Interest Rate</label>
                                <div className={styles.inlineField}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        value={interest}
                                        min={0}
                                        step={0.01}
                                        onChange={(e) =>
                                            setInterest(clamp(parseFloat(e.target.value || 0), 0, 25))
                                        }
                                    />
                                    <span className={styles.suffix}>%</span>
                                </div>
                                <input
                                    type="range"
                                    className={styles.slider}
                                    min="0"
                                    max="25"
                                    step="0.01"
                                    value={interest}
                                    onChange={(e) => setInterest(parseFloat(e.target.value))}
                                />
                            </div>

                            {/* Loan period */}
                            <div className={styles.block}>
                                <label className={styles.lbl}>Loan Period</label>
                                <div className={styles.yearBtns}>
                                    {LOAN_YEARS.map((y) => (
                                        <button
                                            key={y}
                                            type="button"
                                            className={`${styles.yearBtn} ${years === y ? styles.yearBtnActive : ""}`}
                                            onClick={() => setYears(y)}
                                        >
                                            {y}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* === RIGHT: Summary card === */}
                        <div className={styles.summary}>
                            <p className={styles.summaryEyebrow}>Monthly Payment</p>
                            <div className={styles.monthly}>AED {fmt(monthly)}</div>

                            <ul className={styles.kvList}>
                                <li>
                                    <span>Car Price</span>
                                    <b>AED {fmt(carPrice)}</b>
                                </li>
                                <li>
                                    <span>Down Payment</span>
                                    <b>
                                        AED {fmt(downAmt)} / {Math.round(downPct)}%
                                    </b>
                                </li>
                                <li>
                                    <span>Total Loan Amount</span>
                                    <b>AED {fmt(principal)}</b>
                                </li>
                                <li>
                                    <span>Loan Period</span>
                                    <b>{years} {years === 1 ? "Year" : "Years"}</b>
                                </li>
                                <li>
                                    <span>Total interest</span>
                                    <b>AED {fmt(totalInterest)}</b>
                                </li>
                            </ul>
                        </div>
                    </div>

                    </div>

                    <div className={styles.note}>
                        * These figures are estimates and for illustration only. Exact rates are subject to bank approval.
                    </div>

                </div>
            </div>
        </section>
    );
}
