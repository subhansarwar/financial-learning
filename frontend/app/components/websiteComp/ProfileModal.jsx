"use client";

import { Camera, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUserAvatar, updateUserName } from "../../store/slices/user/userThunks";

const THEME = "#14301F";

export default function ProfileModal({ isOpen, onClose }) {
    const dispatch = useAppDispatch();
    const { user, loading } = useAppSelector((state) => state.user);

    const [fullName, setFullName] = useState(user?.full_name || "");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(/\s+/)
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            // 5MB limit — apni requirement ke hisaab se adjust kar lein
            return;
        }

        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const nameChanged = fullName.trim() && fullName.trim() !== user?.full_name;
            const avatarChanged = Boolean(avatarFile);

            if (nameChanged) {
                await dispatch(updateUserName({ full_name: fullName.trim() })).unwrap();
            }
            if (avatarChanged) {
                await dispatch(updateUserAvatar(avatarFile)).unwrap();
            }

            setAvatarFile(null);
            onClose();
        } catch (error) {
            // Error toast thunk ke andar already ho raha hai
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setFullName(user?.full_name || "");
        setAvatarFile(null);
        setAvatarPreview(user?.avatar_url || null);
        onClose();
    };

    const hasChanges =
        (fullName.trim() && fullName.trim() !== user?.full_name) || Boolean(avatarFile);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-5 py-4 sm:px-6"
                    style={{ background: THEME }}
                >
                    <h2 className="text-base font-bold text-white sm:text-lg">Edit Profile</h2>
                    <button
                        onClick={handleClose}
                        className="grid h-8 w-8 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                        aria-label="Close"
                    >
                        <X className="h-4.5 w-4.5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-6 sm:px-6">
                    {/* Avatar */}
                    <div className="mb-6 flex flex-col items-center">
                        <div className="group relative">
                            <div
                                className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full text-2xl font-bold text-white sm:h-28 sm:w-28"
                                style={{ background: THEME }}
                            >
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    getInitials(fullName || user?.email)
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-gray-800 text-white shadow-md transition-transform hover:scale-110"
                                aria-label="Change photo"
                            >
                                <Camera className="h-4 w-4" />
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                        <p className="mt-3 text-xs text-gray-400">Click camera icon to change photo</p>
                    </div>

                    {/* Name Field */}
                    <div className="mb-2">
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 outline-none transition-colors focus:border-[#14301F] focus:ring-2 focus:ring-[#14301F]/10"
                        />
                    </div>

                    {/* Email (read-only reference) */}
                    <div className="mt-4">
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                            Email
                        </label>
                        <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-400"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
                    <button
                        onClick={handleClose}
                        className="rounded-full px-5 py-2 text-sm font-bold text-gray-500 transition-colors hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving || loading}
                        className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                        style={{ background: THEME }}
                    >
                        {isSaving || loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}