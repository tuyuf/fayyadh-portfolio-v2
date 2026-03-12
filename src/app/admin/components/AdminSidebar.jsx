"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Palette, Camera, Video, Code2 } from "lucide-react";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/casestudies", label: "Case Studies", icon: Palette },
    { href: "/admin/photos", label: "Photography", icon: Camera },
    { href: "/admin/videos", label: "Videography", icon: Video },
    { href: "/admin/webprojects", label: "Web Dev", icon: Code2 },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] sticky top-16">
            <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-black text-white"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                                }`}
                        >
                            <Icon size={18} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
