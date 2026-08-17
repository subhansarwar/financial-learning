"use client";

import esgData from "@/data/esg.json";
import { useEffect, useState } from 'react';

const ToolComp = () => {
    const [activeTool, setActiveTool] = useState("budget");
    const [budget, setBudget] = useState({ income: 3000, needs: 50, wants: 30, save: 20 });
    const [compound, setCompound] = useState({ principal: 1000, monthly: 200, rate: 7, years: 30 });
    const [esg, setEsg] = useState({ companyA: "", companyB: "" });

    useEffect(() => {
        if (esgData.companies.length > 0) {
            setEsg({
                companyA: esgData.companies[0].id,
                companyB: esgData.companies[1]?.id || esgData.companies[0].id
            });
        }
    }, []);

    const money = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });
    const formatCurrency = (n) => "$" + money(n);

    // Budget Calculator
    const calculateBudget = () => {
        const { income, needs, wants, save } = budget;
        const total = needs + wants + save;
        const warning = total === 100 ? "" : total > 100 ? `⚠️ Adds up to ${total}% — trim ${total - 100}%.` : `You have ${100 - total}% unallocated.`;
        return { total, warning };
    };

    const budgetResult = calculateBudget();

    // Compound Interest Calculator
    const calculateCompound = () => {
        const { principal, monthly, rate, years } = compound;
        const i = rate / 100 / 12;
        const n = years * 12;
        let bal = principal;
        let paid = principal;
        for (let m = 1; m <= n; m++) {
            bal = bal * (1 + i) + monthly;
            paid += monthly;
        }
        return { final: bal, paid, growth: bal - paid };
    };

    const compoundResult = calculateCompound();

    // ESG Comparison
    const getESGCompanies = () => {
        const A = esgData.companies.find(c => c.id === esg.companyA);
        const B = esgData.companies.find(c => c.id === esg.companyB);
        return { A, B };
    };

    const esgCompanies = getESGCompanies();
    return (
        <section className="section tight" style={{ paddingTop: "48px" }}>
            <div className="wrap">
                <span className="overline">Tools</span>
                <h1 className="section-title" style={{ marginBottom: "8px" }}>Turn theory into numbers</h1>
                <p className="text-muted" style={{ marginBottom: "26px" }}>Free forever, no sign-up. Everything runs in your browser — your numbers never leave your device.</p>

                <div className="tool-tabs" role="tablist">
                    <button className={activeTool === "budget" ? "active" : ""} onClick={() => setActiveTool("budget")}>💼 Budgeting calculator</button>
                    <button className={activeTool === "compound" ? "active" : ""} onClick={() => setActiveTool("compound")}>📈 Compound interest</button>
                    <button className={activeTool === "esg" ? "active" : ""} onClick={() => setActiveTool("esg")}>🌱 ESG comparison</button>
                </div>

                {/* Budget Tool */}
                {activeTool === "budget" && (
                    <div className="tool-panel active">
                        <div className="tool-grid">
                            <div className="tool-form">
                                <div className="field">
                                    <label htmlFor="bIncome">Monthly take-home income</label>
                                    <input
                                        type="number"
                                        id="bIncome"
                                        value={budget.income}
                                        onChange={(e) => setBudget({ ...budget, income: +e.target.value })}
                                        min="0"
                                        step="50"
                                    />
                                    <p className="hint">After tax, in your currency.</p>
                                </div>
                                <div className="field">
                                    <label htmlFor="bNeeds">Needs — rent, bills, groceries (%)</label>
                                    <input
                                        type="number"
                                        id="bNeeds"
                                        value={budget.needs}
                                        onChange={(e) => setBudget({ ...budget, needs: +e.target.value })}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="bWants">Wants — fun, eating out (%)</label>
                                    <input
                                        type="number"
                                        id="bWants"
                                        value={budget.wants}
                                        onChange={(e) => setBudget({ ...budget, wants: +e.target.value })}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="bSave">Savings & extra debt payments (%)</label>
                                    <input
                                        type="number"
                                        id="bSave"
                                        value={budget.save}
                                        onChange={(e) => setBudget({ ...budget, save: +e.target.value })}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <p className="hint" id="bWarn">{budgetResult.warning}</p>
                            </div>
                            <div className="tool-result">
                                <span className="overline">Your monthly plan</span>
                                <div style={{ display: "flex", gap: "34px", flexWrap: "wrap", alignItems: "center" }}>
                                    <div style={{ flex: "1", minWidth: "220px" }}>
                                        <div className="result-rows">
                                            <div className="result-row">
                                                <span><i style={{ display: "inline-block", width: "11px", height: "11px", borderRadius: "3px", background: "#0d3b2e", marginRight: "8px" }}></i>Needs ({budget.needs}%)</span>
                                                <b>{formatCurrency(budget.income * budget.needs / 100)}</b>
                                            </div>
                                            <div className="result-row">
                                                <span><i style={{ display: "inline-block", width: "11px", height: "11px", borderRadius: "3px", background: "#c99b4a", marginRight: "8px" }}></i>Wants ({budget.wants}%)</span>
                                                <b>{formatCurrency(budget.income * budget.wants / 100)}</b>
                                            </div>
                                            <div className="result-row">
                                                <span><i style={{ display: "inline-block", width: "11px", height: "11px", borderRadius: "3px", background: "#12a15f", marginRight: "8px" }}></i>Savings ({budget.save}%)</span>
                                                <b>{formatCurrency(budget.income * budget.save / 100)}</b>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="notice" style={{ marginBottom: "0" }}>
                                    <span>💡</span>
                                    <div>The classic starting point is <b>50/30/20</b>. High-rent city? Trim wants first — keep the savings habit alive, even at 5%.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Compound Tool */}
                {activeTool === "compound" && (
                    <div className="tool-panel active">
                        <div className="tool-grid">
                            <div className="tool-form">
                                <div className="field">
                                    <label htmlFor="cPrincipal">Starting amount</label>
                                    <input
                                        type="number"
                                        id="cPrincipal"
                                        value={compound.principal}
                                        onChange={(e) => setCompound({ ...compound, principal: +e.target.value })}
                                        min="0"
                                        step="100"
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="cMonthly">Monthly contribution</label>
                                    <input
                                        type="number"
                                        id="cMonthly"
                                        value={compound.monthly}
                                        onChange={(e) => setCompound({ ...compound, monthly: +e.target.value })}
                                        min="0"
                                        step="10"
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="cRate">Annual return (%)</label>
                                    <input
                                        type="number"
                                        id="cRate"
                                        value={compound.rate}
                                        onChange={(e) => setCompound({ ...compound, rate: +e.target.value })}
                                        step="0.1"
                                    />
                                    <p className="hint">Long-run stock-market averages are often quoted around 7% before inflation — no outcome is guaranteed.</p>
                                </div>
                                <div className="field">
                                    <label htmlFor="cYears">Years</label>
                                    <input
                                        type="number"
                                        id="cYears"
                                        value={compound.years}
                                        onChange={(e) => setCompound({ ...compound, years: +e.target.value })}
                                        min="1"
                                        max="60"
                                    />
                                </div>
                            </div>
                            <div className="tool-result">
                                <span className="overline">Projected balance</span>
                                <div className="big-number">{formatCurrency(compoundResult.final)}</div>
                                <div className="result-rows">
                                    <div className="result-row"><span>You paid in</span><b>{formatCurrency(compoundResult.paid)}</b></div>
                                    <div className="result-row"><span>Growth from compounding</span><b style={{ color: "var(--emerald)" }}>{formatCurrency(compoundResult.growth)}</b></div>
                                    <div className="result-row"><span>Growth multiple</span><b>{compoundResult.paid ? (compoundResult.final / compoundResult.paid).toFixed(2) : "—"}×</b></div>
                                </div>
                                <div className="notice" style={{ marginBottom: "0" }}>
                                    <span>💡</span>
                                    <div>Try 30 years vs 40 — that gap is the whole argument for starting early. This is an illustration, not a prediction.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ESG Tool */}
                {activeTool === "esg" && (
                    <div className="tool-panel active">
                        <div className="tool-grid">
                            <div className="tool-form">
                                <div className="field">
                                    <label htmlFor="eA">Company A</label>
                                    <select
                                        id="eA"
                                        value={esg.companyA}
                                        onChange={(e) => setEsg({ ...esg, companyA: e.target.value })}
                                    >
                                        {esgData.companies.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} — {c.sector}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="field">
                                    <label htmlFor="eB">Company B</label>
                                    <select
                                        id="eB"
                                        value={esg.companyB}
                                        onChange={(e) => setEsg({ ...esg, companyB: e.target.value })}
                                    >
                                        {esgData.companies.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} — {c.sector}</option>
                                        ))}
                                    </select>
                                </div>
                                <p className="hint">Demo dataset — fictional companies for learning. The team can load real data in the admin panel.</p>
                            </div>
                            <div className="tool-result">
                                <span className="overline">Head to head</span>
                                {esgCompanies.A && esgCompanies.B && (
                                    <>
                                        <div className="legend" style={{ marginTop: "2px" }}>
                                            <span><i style={{ background: "var(--gold)" }}></i>{esgCompanies.A.name}</span>
                                            <span><i style={{ background: "var(--olive)" }}></i>{esgCompanies.B.name}</span>
                                        </div>
                                        <div style={{ margin: "14px 0" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", fontWeight: "700" }}>
                                                <span>Environmental</span>
                                                <span>{esgCompanies.A.e} vs {esgCompanies.B.e}</span>
                                            </div>
                                            <div style={{ height: "7px", background: "rgba(0,0,0,0.08)", borderRadius: "99px", marginTop: "6px", overflow: "hidden" }}>
                                                <div style={{ height: "100%", width: `${esgCompanies.A.e}%`, background: "var(--gold)", borderRadius: "99px" }}></div>
                                            </div>
                                            <div style={{ height: "7px", background: "rgba(0,0,0,0.08)", borderRadius: "99px", marginTop: "3px", overflow: "hidden" }}>
                                                <div style={{ height: "100%", width: `${esgCompanies.B.e}%`, background: "var(--olive)", borderRadius: "99px" }}></div>
                                            </div>
                                        </div>
                                        <div style={{ margin: "14px 0" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", fontWeight: "700" }}>
                                                <span>Social</span>
                                                <span>{esgCompanies.A.s} vs {esgCompanies.B.s}</span>
                                            </div>
                                            <div style={{ height: "7px", background: "rgba(0,0,0,0.08)", borderRadius: "99px", marginTop: "6px", overflow: "hidden" }}>
                                                <div style={{ height: "100%", width: `${esgCompanies.A.s}%`, background: "var(--gold)", borderRadius: "99px" }}></div>
                                            </div>
                                            <div style={{ height: "7px", background: "rgba(0,0,0,0.08)", borderRadius: "99px", marginTop: "3px", overflow: "hidden" }}>
                                                <div style={{ height: "100%", width: `${esgCompanies.B.s}%`, background: "var(--olive)", borderRadius: "99px" }}></div>
                                            </div>
                                        </div>
                                        <div style={{ margin: "14px 0" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", fontWeight: "700" }}>
                                                <span>Governance</span>
                                                <span>{esgCompanies.A.g} vs {esgCompanies.B.g}</span>
                                            </div>
                                            <div style={{ height: "7px", background: "rgba(0,0,0,0.08)", borderRadius: "99px", marginTop: "6px", overflow: "hidden" }}>
                                                <div style={{ height: "100%", width: `${esgCompanies.A.g}%`, background: "var(--gold)", borderRadius: "99px" }}></div>
                                            </div>
                                            <div style={{ height: "7px", background: "rgba(0,0,0,0.08)", borderRadius: "99px", marginTop: "3px", overflow: "hidden" }}>
                                                <div style={{ height: "100%", width: `${esgCompanies.B.g}%`, background: "var(--olive)", borderRadius: "99px" }}></div>
                                            </div>
                                        </div>
                                        <div className="esg-verdict">
                                            <b>{esgCompanies.A.name} scores higher overall.</b><br />
                                            <span className="text-muted">{esgCompanies.A.summary}<br />{esgCompanies.B.summary}</span><br />
                                            <span style={{ fontSize: ".82rem" }}>Remember the course lesson: always read the methodology behind a score. Illustrative data only.</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default ToolComp
