// app/components/websiteComp/contactComp/ContactSection.jsx
"use client";

import { Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function ContactSection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: false, amount: 0.15 });

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        // Wire this up to your actual submit endpoint.
        setTimeout(() => setSubmitting(false), 800);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.05 },
        },
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const fadeInRight = {
        hidden: { opacity: 0, x: 30, scale: 0.98 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { duration: 0.7, ease: "easeOut" },
        },
    };

    const contactDetails = [
        {
            icon: Mail,
            label: "Email:",
            value: "info@glimpse.com",
        },
        {
            icon: Phone,
            label: "Phone:",
            value: "+1 (800) 123-4567",
        },
        {
            icon: MapPin,
            label: "Location:",
            value: "Silicon Valley, CA 94043 United States",
        },
    ];

    return (
        <section
            ref={sectionRef}
            className="bg-[#ffffff] px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
                {/* ===== LEFT: Copy + contact details ===== */}
                <div>
                    {/* Contact badge */}
                    <motion.div
                        variants={fadeUp}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm"
                    >
                        <Mail className="h-3.5 w-3.5 text-[#1E4D35]" strokeWidth={2.25} />
                        Contact
                    </motion.div>

                    {/* Heading */}
                    <motion.h2
                        variants={fadeUp}
                        className="mt-4 max-w-md text-[1.9rem] font-extrabold leading-[1.15] tracking-tight text-[#0B0B1F] sm:text-[2.2rem] md:text-[2.5rem] lg:text-[2.7rem]"
                    >
                        How can we help you today?
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        variants={fadeUp}
                        className="mt-4 max-w-sm text-sm leading-relaxed text-gray-500"
                    >
                        Our dedicated customer support team is just a message or call
                        away.
                    </motion.p>

                    {/* Contact detail rows */}
                    <div className="mt-8 flex flex-col gap-5 sm:mt-10 sm:gap-6">
                        {contactDetails.map(({ icon: Icon, label, value }) => (
                            <motion.div
                                key={label}
                                variants={fadeUp}
                                className="flex items-start gap-3.5"
                            >
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E6FBF1]">
                                    <Icon
                                        className="h-5 w-5 text-[#1E4D35]"
                                        strokeWidth={2}
                                    />
                                </span>
                                <span className="pt-1">
                                    <span className="block text-sm text-gray-500">
                                        {label}
                                    </span>
                                    <span className="block text-sm font-bold text-[#0B0B1F] sm:text-[15px]">
                                        {value}
                                    </span>
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ===== RIGHT: Form card ===== */}
                <motion.div
                    variants={fadeInRight}
                    className="rounded-2xl border border-gray-100 bg-[#E6FBF1] p-5 sm:p-7 lg:p-8"
                >
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* First / Last name */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <Field label="First name" required>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter first name"
                                    required
                                    className={inputClasses}
                                />
                            </Field>
                            <Field label="Last name" required>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter last name"
                                    required
                                    className={inputClasses}
                                />
                            </Field>
                        </div>

                        {/* Work email */}
                        <Field label="Work email" required>
                            <input
                                type="email"
                                name="workEmail"
                                placeholder="Enter email"
                                required
                                className={inputClasses}
                            />
                        </Field>

                        {/* Phone number */}
                        <Field label="Phone number" required>
                            <div className="flex items-center gap-2">
                                <div className="relative flex shrink-0 items-center gap-1 rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-7 text-sm text-gray-700">
                                    <span aria-hidden="true">🇺🇸</span>
                                    <span>+1</span>
                                    <ChevronDown
                                        className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-gray-400"
                                        strokeWidth={2}
                                    />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    required
                                    className={inputClasses + " flex-1"}
                                />
                            </div>
                        </Field>

                        {/* Message */}
                        <Field label="Message" required>
                            <textarea
                                name="message"
                                placeholder="Enter a question, feedback, or suggestions..."
                                required
                                rows={4}
                                className={inputClasses + " resize-none"}
                            />
                        </Field>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-1 inline-flex w-fit items-center justify-center rounded-xl bg-[#1E4D35] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1E4D35] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </section>
    );
}

const inputClasses =
    "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-150 focus:border-[#1E4D35] focus:ring-4 focus:ring-[#1E4D35]/15";

function Field({ label, required, children }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#0B0B1F]">
                {label}
                {required && <span className="text-[#7C5CFA]">*</span>}
            </span>
            {children}
        </label>
    );
}