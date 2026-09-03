// app/components/LoadingSpinner.jsx
export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#72BB83]/20 border-t-[#72BB83]" />
        </div>
    );
}