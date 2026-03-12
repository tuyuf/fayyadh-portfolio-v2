"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Palette, Camera, Video, Code2 } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ casestudies: 0, photos: 0, videos: 0, webprojects: 0 });

    useEffect(() => {
        async function loadStats() {
            try {
                const [cs, ph, vi, wp] = await Promise.all([
                    fetch("/api/casestudies").then((r) => r.json()),
                    fetch("/api/photos").then((r) => r.json()),
                    fetch("/api/videos").then((r) => r.json()),
                    fetch("/api/webprojects").then((r) => r.json()),
                ]);
                setStats({
                    casestudies: cs.length || 0,
                    photos: ph.length || 0,
                    videos: vi.length || 0,
                    webprojects: wp.length || 0,
                });
            } catch (e) {
                console.error("Failed to load stats", e);
            }
        }
        loadStats();
    }, []);

    const cards = [
        { label: "Case Studies", count: stats.casestudies, href: "/admin/casestudies", icon: Palette, color: "bg-purple-50 text-purple-600" },
        { label: "Photography", count: stats.photos, href: "/admin/photos", icon: Camera, color: "bg-blue-50 text-blue-600" },
        { label: "Videography", count: stats.videos, href: "/admin/videos", icon: Video, color: "bg-red-50 text-red-600" },
        { label: "Web Dev", count: stats.webprojects, href: "/admin/webprojects", icon: Code2, color: "bg-green-50 text-green-600" },
    ];

    return (
        <div>
            <h1 className="text-3xl font-heading mb-2">Dashboard</h1>
            <p className="text-gray-500 mb-8">Overview of your portfolio content.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.href}
                            href={card.href}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${card.color}`}>
                                <Icon size={20} />
                            </div>
                            <p className="text-3xl font-heading mb-1">{card.count}</p>
                            <p className="text-sm text-gray-500">{card.label}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
