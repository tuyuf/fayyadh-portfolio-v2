"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === "/admin/login";

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
    };

    if (isLoginPage) return <>{children}</>;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-[var(--font-body)]">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/admin" className="text-xl font-heading font-bold">
                        Portfolio CMS
                    </Link>
                    <nav className="flex items-center gap-6 text-sm">
                        <Link
                            href="/"
                            target="_blank"
                            className="text-gray-500 hover:text-black transition-colors"
                        >
                            View Site ↗
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-medium cursor-pointer"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </nav>
                </div>
            </header>

            <div className="flex max-w-[1400px] mx-auto">
                <AdminSidebar />
                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
}
