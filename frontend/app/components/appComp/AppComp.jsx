"use client";
import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic";


const Chart = dynamic(() => import("chart.js/auto"), { ssr: false });
const AppComp = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <div className="wrap" style={{ padding: "60px 0", textAlign: "center" }}>
                <p>Loading PocketPilot...</p>
            </div>
        );
    }

    // Since the PocketPilot app is complex, we'll load it dynamically
    // You can copy the entire PocketPilot HTML/JS into a separate component
    return (
        <div className="wrap" style={{ padding: "20px 0" }}>
            <div className="hero" style={{ background: "var(--black)", color: "white", padding: "40px 24px", borderRadius: "20px" }}>
                <h2 style={{ fontSize: "2rem", marginBottom: "8px" }}>💼 PocketPilot</h2>
                <p className="text-muted" style={{ color: "#e5dcc4" }}>
                    Mock money management app — practice budgeting, debt tracking, and financial planning.
                </p>
                <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <div className="fact-card" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <div className="fact-value" style={{ color: "var(--gold)" }}>$7,284</div>
                        <div className="fact-label" style={{ color: "#e5dcc4" }}>Total Balance</div>
                    </div>
                    <div className="fact-card" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <div className="fact-value" style={{ color: "var(--gold)" }}>36%</div>
                        <div className="fact-label" style={{ color: "#e5dcc4" }}>DTI Ratio</div>
                    </div>
                    <div className="fact-card" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <div className="fact-value" style={{ color: "var(--gold)" }}>4</div>
                        <div className="fact-label" style={{ color: "#e5dcc4" }}>Active Debts</div>
                    </div>
                </div>
            </div>
            <div style={{ marginTop: "24px" }}>
                <div className="grid cols-2">
                    <div className="card">
                        <h3>📊 Monthly Budget</h3>
                        <div className="bud" style={{ marginTop: "12px" }}>
                            <div className="top"><span>🏠 Housing</span><span className="r">$950 / $950 · 100%</span></div>
                            <div className="bar"><i style={{ width: "100%" }}></i></div>
                        </div>
                        <div className="bud">
                            <div className="top"><span>🛒 Groceries</span><span className="r">$372 / $400 · 93%</span></div>
                            <div className="bar"><i style={{ width: "93%" }}></i></div>
                        </div>
                        <div className="bud">
                            <div className="top"><span>🍜 Dining out</span><span className="r over">$218 / $150 · 145% ⚠️</span></div>
                            <div className="bar"><i className="over" style={{ width: "145%" }}></i></div>
                        </div>
                    </div>
                    <div className="card">
                        <h3>💳 Active Debts</h3>
                        <div className="debt">
                            <div className="dic">🚗</div>
                            <div><div className="n">Car loan</div><div className="d">$8,200 left · 6.5% APR</div></div>
                            <div className="amt"><div className="p">$310/mo</div></div>
                        </div>
                        <div className="debt">
                            <div className="dic">🎓</div>
                            <div><div className="n">Student loan</div><div className="d">$11,400 left · 4.8% APR</div></div>
                            <div className="amt"><div className="p">$175/mo</div></div>
                        </div>
                        <div className="debt">
                            <div className="dic">💳</div>
                            <div><div className="n">Credit card</div><div className="d">$2,350 left · 22.9% APR</div></div>
                            <div className="amt"><div className="p">$110/mo</div></div>
                        </div>
                    </div>
                </div>
                <div className="notice mt-2">
                    <span>💡</span>
                    <div>
                        <b>Education, not advice.</b> PocketPilot is a mock app with fake data —
                        a demo surface of Finance Platform Demo. No real accounts are connected.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppComp
