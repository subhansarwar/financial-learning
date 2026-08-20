// app/(website)/layout.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function WebsiteLayout({ children }) {
    return (
        <>
            <Header />
            <main id="main">{children}</main>
            <Footer />
        </>
    );
}