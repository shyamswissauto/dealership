"use client";

import { useMemo, useState } from "react";
import styles from "./EmiCalculator1.module.css";

/** 👉 Configure your models here */
const CAR_MODELS = [
    { id: "base", name: "Select a model", price: 0 },
    { id: "boldenoffroad", name: "Bolden S9 Off-Road", price: 120000 },
    { id: "boldenpassenger", name: "Bolden S7 Passenger", price: 100000 },
    { id: "boldencomyoung4wd", name: "Bolden S6 Commercial Young 4WD", price: 85000 },
    { id: "boldencomyoungrwd", name: "Bolden S6 Commercial Young 2WD", price: 70000 },
];

const LOAN_YEARS = [1, 2, 3, 4, 5];

export default function EmiCalculator1() {
    // state
    const [modelId, setModelId] = useState(CAR_MODELS[1].id); // default 1st real model
    const modelPrice = useMemo(
        () => (CAR_MODELS.find(m => m.id === modelId) || CAR_MODELS[0]).price,
        [modelId]
    );

    const [carPrice, setCarPrice] = useState(modelPrice || 120000);
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
                    {/* <div className={styles.header}>
                        <h2>Car Finance Calculator</h2>
                    </div> */}

                    <div className={styles.glass}>

                        <div className={styles.grid}>
                            {/* === LEFT: Controls === */}



                            {/* === LEFT: Controls === */}
                            <div className={styles.controls}>


                                <div className={styles.block}>
                                    <label className={styles.lbl}>موديل السيارة</label>
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

                                {/* Row 1 — Car Price & Down Payment */}
                                <div className={styles.controlsRow}>
                                    {/* Car Price */}
                                    <div className={styles.block}>
                                        <label className={styles.lbl}>سعر السيارة</label>
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

                                    {/* Down Payment */}
                                    <div className={styles.block}>
                                        <label className={styles.lbl}>الدفعة الأولى</label>
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
                                </div>

                                {/* Row 2 — Interest Rate & Loan Period */}
                                <div className={styles.controlsRow}>
                                    {/* Interest */}
                                    <div className={styles.block}>
                                        <label className={styles.lbl}>سعر الفائدة</label>
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
                                        <label className={styles.lbl}>مدة القرض</label>
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

                                {/* Car Model stays above the rows */}
                                {/* If you want the model selector at the very top, leave it where it is */}
                            </div>


                            {/* === RIGHT: Summary card === */}
                            <div className={styles.summary}>
                                <p className={styles.summaryEyebrow}>الدفعة الشهرية</p>
                                <div className={styles.monthly}>AED {fmt(monthly)}</div>

                                <ul className={styles.kvList}>
                                    <li>
                                        <span>سعر السيارة</span>
                                        <b>AED {fmt(carPrice)}</b>
                                    </li>
                                    <li>
                                        <span>الدفعة الأولى</span>
                                        <b>
                                            AED {fmt(downAmt)} / {Math.round(downPct)}%
                                        </b>
                                    </li>
                                    <li>
                                        <span>إجمالي مبلغ القرض</span>
                                        <b>AED {fmt(principal)}</b>
                                    </li>
                                    <li>
                                        <span>مدة القرض</span>
                                        <b>{years} {years === 1 ? "Year" : "Years"}</b>
                                    </li>
                                    <li>
                                        <span>المجموع الفائدة</span>
                                        <b>AED {fmt(totalInterest)}</b>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    <div className={styles.note}>
                        * الأرقام المعروضة هي لأغراض توضيحية فقط. تخضع الأسعار النهائية والموافقات لتقدير البنك المعني
                    </div>

                </div>
            </div>
        </section>
    );
}
