// // app/components/adminPanelComp/AdminClient.jsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import AdminLogin from "./AdminLogin";
// import AdminDashboard from "./AdminDashboard";
// import Sidebar from "./Sidebar";
// import { Loader2 } from "lucide-react";
// import { useAppDispatch } from "../../store/hooks";
// import { logoutUser } from "../../store/slices/user/userThunks";

// export default function AdminClient({ initialCourses, initialTopics }) {
//     const router = useRouter();
//     const dispatch = useAppDispatch()
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [courses, setCourses] = useState(initialCourses);
//     const [topics, setTopics] = useState(initialTopics);
//     const [activeTab, setActiveTab] = useState("dashboard");

//     useEffect(() => {
//         if (typeof window !== "undefined") {
//             const token = sessionStorage.getItem("fl_admin");
//             if (token) {
//                 setIsAuthenticated(true);
//             } else {
//                 router.push("/admin/login");
//             }
//         }
//         setLoading(false);
//     }, [router]);

//     const handleLogin = () => {
//         setIsAuthenticated(true);
//     };

//     const handleLogout = () => {
//         dispatch(logoutUser())
//         // if (typeof window !== "undefined") {
//         //     sessionStorage.removeItem("fl_admin");
//         // }
//         setIsAuthenticated(false);
//         // router.push("/");
//     };

//     const refreshData = async () => {
//         try {
//             const response = await fetch("/api/admin/refresh");
//             if (response.ok) {
//                 const data = await response.json();
//                 setCourses(data.courses || initialCourses);
//                 setTopics(data.topics || initialTopics);
//             }
//         } catch (_) {
//             // Fallback to initial data
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex min-h-screen items-center justify-center bg-cream">
//                 <div className="flex flex-col items-center gap-3">
//                     <Loader2 className="h-10 w-10 animate-spin text-brand" strokeWidth={2} />
//                     <p className="text-sm text-muted">Loading admin panel...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!isAuthenticated) {
//         return <AdminLogin onLogin={handleLogin} />;
//     }

//     return (
//         <div className="flex min-h-screen w-full">
//             <Sidebar
//                 activeTab={activeTab}
//                 onTabChange={setActiveTab}
//                 onLogout={handleLogout}
//                 courses={courses}
//                 topics={topics}
//             />
//             <div className="flex-1 overflow-x-hidden">
//                 <AdminDashboard
//                     activeTab={activeTab}
//                     courses={courses}
//                     topics={topics}
//                     onDataChange={refreshData}
//                 />
//             </div>
//         </div>
//     );
// }

// app/components/adminPanelComp/AdminClient.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import Sidebar from "./Sidebar";
import { Loader2 } from "lucide-react";
// import { useAppDispatch } from "../../store/hooks";
// import { logoutUser } from "../../store/slices/user/userThunks";

export default function AdminClient({ initialCourses, initialTopics }) {
    const router = useRouter();
    // const dispatch = useAppDispatch()
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState(initialCourses);
    const [topics, setTopics] = useState(initialTopics);
    const [activeTab, setActiveTab] = useState("dashboard");

    useEffect(() => {
        // Commented out - Direct access without authentication check
        // if (typeof window !== "undefined") {
        //     const token = sessionStorage.getItem("fl_admin");
        //     if (token) {
        //         setIsAuthenticated(true);
        //     } else {
        //         router.push("/admin/login");
        //     }
        // }
        // setLoading(false);

        // Direct access - set authenticated to true
        setIsAuthenticated(true);
        setLoading(false);
    }, [router]);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        // dispatch(logoutUser())
        // if (typeof window !== "undefined") {
        //     sessionStorage.removeItem("fl_admin");
        // }
        setIsAuthenticated(false);
        // router.push("/");
    };

    const refreshData = async () => {
        try {
            const response = await fetch("/api/admin/refresh");
            if (response.ok) {
                const data = await response.json();
                setCourses(data.courses || initialCourses);
                setTopics(data.topics || initialTopics);
            }
        } catch (_) {
            // Fallback to initial data
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-cream">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-brand" strokeWidth={2} />
                    <p className="text-sm text-muted">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    return (
        <div className="flex min-h-screen w-full">
            <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={handleLogout}
                courses={courses}
                topics={topics}
            />
            <div className="flex-1 overflow-x-hidden">
                <AdminDashboard
                    activeTab={activeTab}
                    courses={courses}
                    topics={topics}
                    onDataChange={refreshData}
                />
            </div>
        </div>
    );
}