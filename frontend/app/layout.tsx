import "./globals.css";
import { Lato } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";


const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
  variable: "--font-lato",
});
export const metadata = {
  title: "Finance Platform Free finance education for everyone",
  description: "Free courses in microfinance and sustainable finance microcredit, micro-savings, micro-insurance, micro-leasing, green energy, ESG and more.",
  keywords: "finance education, microfinance, sustainable finance, free courses, ESG, financial inclusion",
  authors: [{ name: "Finance Platform Demo" }],
  openGraph: {
    title: "Finance Platform — Free finance education",
    description: "Learn microfinance and sustainable finance for free. Complete courses, earn certificates.",
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
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en" className={lato.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}