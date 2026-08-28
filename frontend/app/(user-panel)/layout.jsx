// app/(user-panel)/layout.jsx
"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserSidebar from "../components/userDashboardComp/UserSidebar";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setInitialized, setToken, setUser } from "../store/slices/user/userSlice";
import { logoutUser } from "../store/slices/user/userThunks";

export default function UserPanelLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { isAuthenticated, loading, user } = useAppSelector((state) => state.user);

    const [activeTab, setActiveTab] = useState("dashboard");
    const [mounted, setMounted] = useState(false);


    useEffect(() => {
        setMounted(true);

        // Check authentication
        const checkAuth = () => {
            console.log("Checking auth - isAuthenticated:", isAuthenticated);
            console.log("Checking auth - user:", user);

            if (isAuthenticated && user) {
                console.log("Authenticated via Redux");
                return true;
            }

            if (typeof window !== "undefined") {
                const userData = localStorage.getItem("efp.user");
                const token = localStorage.getItem("auth_token");

                console.log("localStorage - userData:", userData);
                console.log("localStorage - token:", token);

                if (userData && token) {
                    try {
                        const parsedUser = JSON.parse(userData);
                        console.log("Setting user from localStorage:", parsedUser);
                        dispatch(setUser(parsedUser));
                        dispatch(setToken(token));
                        dispatch(setInitialized(true));
                        return true;
                    } catch (e) {
                        console.error("Error parsing user data:", e);
                        return false;
                    }
                }
            }
            return false;
        };

        const authenticated = checkAuth();

        if (!authenticated && mounted) {
            router.push("/login");
        }
    }, [isAuthenticated, user, router, dispatch, mounted]);

    // Set active tab based on pathname
    useEffect(() => {
        if (pathname) {
            const path = pathname.split("/").pop() || "dashboard";
            setActiveTab(path);
        }
    }, [pathname]);

    const handleLogout = async () => {
        try {
            // Dispatch logout action
            await dispatch(logoutUser()).unwrap();

            // Redirect to login
            router.push("/login");
        } catch (error) {
            // console.error("Logout error:", error);
            // Even if there's an error, redirect to login
            router.push("/login");
        }
    };

    // Show loading state
    if (!mounted || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-cream">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-brand" strokeWidth={2} />
                </div>
            </div>
        );
    }

    // If not authenticated, redirect (handled in useEffect)
    if (!isAuthenticated && !loading) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-cream">
            <UserSidebar
                user={user}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={handleLogout}
            />
            <main className="flex-1 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}