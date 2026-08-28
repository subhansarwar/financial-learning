// app/website/contact/page.jsx

import ContactSection from "../../components/websiteComp/contactComp/ContactSection";

export const metadata = {
    title: "Contact Us | Glimpse",
    description:
        "Get in touch with the Glimpse team. Our dedicated customer support is just a message or call away — reach us by email, phone, or visit us in Silicon Valley.",
    keywords: [
        "contact us",
        "customer support",
        "get in touch",
        "Glimpse contact",
        "help center",
    ],
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "Contact Us | Glimpse",
        description:
            "Get in touch with the Glimpse team. Our dedicated customer support is just a message or call away.",
        url: "/contact",
        siteName: "Glimpse",
        type: "website",
        images: [
            {
                url: "/assets/og/contact-og.jpg",
                width: 1200,
                height: 630,
                alt: "Contact Glimpse",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Us | Glimpse",
        description:
            "Get in touch with the Glimpse team. Our dedicated customer support is just a message or call away.",
        images: ["/assets/og/contact-og.jpg"],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function ContactPage() {
    return (
        <main>
            <ContactSection />
        </main>
    );
}