// app/(website)/layout.jsx

import Header from "../components/Header";
import Footer from "../components/Footer";
import IntroLoader from "../components/websiteComp/introLoader/IntroLoader";
import CursorProvider from "../components/websiteComp/cursorProvider/CursorProvider";

export default function WebsiteLayout({ children }) {
    return (
        <CursorProvider>
            <IntroLoader>
                <Header />
                <div className="cursor-dot"></div>
                <div className="cursor-ring"></div>
                <main id="main">{children}</main>
                <Footer />
            </IntroLoader>
        </CursorProvider>
    );
}