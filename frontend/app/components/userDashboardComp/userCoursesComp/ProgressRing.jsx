"use client";

// Small circular progress indicator used for course/lecture completion.
// Consistent with the project's existing accent palette (teal / gold / purple / blue).
export default function ProgressRing({
    value = 0,
    size = 64,
    strokeWidth = 5,
    color = "#34C79D",
    trackColor = "rgba(255,255,255,0.12)",
    labelColor = "#FFFFFF",
    subLabel,
    className = "",
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(value, 100) / 100) * circumference;

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={trackColor}
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center leading-none">
                <span className="font-extrabold" style={{ color: labelColor, fontSize: size * 0.26 }}>
                    {value}%
                </span>
                {subLabel && (
                    <span className="mt-0.5 text-[9px] font-medium" style={{ color: labelColor, opacity: 0.6 }}>
                        {subLabel}
                    </span>
                )}
            </div>
        </div>
    );
}