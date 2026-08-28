// app/(user-panel)/progress/page.jsx
import { TrendingUp } from 'lucide-react'
export const metadata = {
    title: "Progress Learning Dashboard | The Eco Lens",
    description: "Track your learning progress across all courses.",
};

export default function ProgressPage() {
    return (
        <div className="flex bg-[#FFF7ED] min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft">
                    <TrendingUp className="h-10 w-10 text-brand-deep" strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-bold text-ink">Progress Tracking</h2>
                <p className="mt-2 text-muted">Track your learning progress across all courses.</p>
            </div>
        </div>
    );
}