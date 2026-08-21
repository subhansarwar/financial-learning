"use client"
import { useState } from "react";
import AgendaFullView from "../../components/userDashboardComp/AgendaFullView";
import AgendaCard from "../../components/userDashboardComp/AgendaCard";



export default function UpcomingClient() {
    const [agendaExpanded, setAgendaExpanded] = useState(false);


    return (
        <section className="py-5 px-5 bg-[#FFF7ED] min-h-screen">
            {/* ===== CREAM SECTION ===== */}
            <div className="py-1 lg:py-1">
                {agendaExpanded ? (
                    <AgendaFullView onBack={() => setAgendaExpanded(false)} />
                ) : (
                    <AgendaCard onViewAll={() => setAgendaExpanded(true)} />
                )}

            </div>
        </section>
    )
}