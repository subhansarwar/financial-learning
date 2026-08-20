// app/layout.jsx
import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ReduxProvider } from "./store/Provider";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Finance Platform Free finance education for everyone",
  description:
    "Free courses in microfinance and sustainable finance: microcredit, micro-savings, micro-insurance, micro-leasing, green energy, ESG and more.",
  keywords:
    "finance education, microfinance, sustainable finance, free courses, ESG, financial inclusion",
  authors: [{ name: "Finance Platform Demo" }],
  openGraph: {
    title: "Finance Platform Free finance education",
    description:
      "Learn microfinance and sustainable finance for free. Complete courses, earn certificates.",
    url: "https://your-domain.com",
    siteName: "Finance Platform Demo",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance Platform Demo",
    description: "Free finance education for everyone.",
    images: ["/og-image.png"],
  },
  robots: "index, follow",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lato.variable} font-sans`}>
      <body className="bg-cream text-ink font-medium text-[16.5px] leading-[1.65] antialiased overflow-x-hidden">
        <ReduxProvider>
          {/* Toaster - Available everywhere */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#1c2033",
                borderRadius: "12px",
                padding: "14px 18px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                fontSize: "14px",
                fontWeight: "500",
                maxWidth: "420px",
              },
              success: {
                style: {
                  borderLeft: "4px solid #10b981",
                },
              },
              error: {
                style: {
                  borderLeft: "4px solid #ef4444",
                },
              },
            }}
          />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}