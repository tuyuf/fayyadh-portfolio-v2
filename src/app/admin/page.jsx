"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Palette,
    Camera,
    Video,
    Code2,
    UserCircle2,
    GraduationCap,
    BriefcaseBusiness,
    ListChecks,
    BarChart3,
} from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        casestudies: 0,
        photos: 0,
        videos: 0,
        webprojects: 0,
        profile: 0,
        education: 0,
        work: 0,
        skills: 0,
        metrics: 0,
    });

    useEffect(() => {
        async function loadStats() {
            try {
                const [cs, ph, vi, wp, profile, education, work, skills, metrics] = await Promise.all([
                    fetch("/api/casestudies").then((r) => r.json()),
                    fetch("/api/photos").then((r) => r.json()),
                    fetch("/api/videos").then((r) => r.json()),
                    fetch("/api/webprojects").then((r) => r.json()),
                    fetch("/api/profile").then((r) => r.json()),
                    fetch("/api/education").then((r) => r.json()),
                    fetch("/api/work").then((r) => r.json()),
                    fetch("/api/skills/items").then((r) => r.json()),
                    fetch("/api/metrics").then((r) => r.json()),
                ]);
                setStats({
                    casestudies: cs.length || 0,
                    photos: ph.length || 0,
                    videos: vi.length || 0,
                    webprojects: wp.length || 0,
                    profile: profile ? 1 : 0,
                    education: education.length || 0,
                    work: work.length || 0,
                    skills: skills.length || 0,
                    metrics: metrics.length || 0,
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
        { label: "Profile", count: stats.profile, href: "/admin/profile", icon: UserCircle2, color: "bg-neutral-50 text-neutral-700" },
        { label: "Education", count: stats.education, href: "/admin/education", icon: GraduationCap, color: "bg-indigo-50 text-indigo-600" },
        { label: "Work", count: stats.work, href: "/admin/work", icon: BriefcaseBusiness, color: "bg-amber-50 text-amber-700" },
        { label: "Skills", count: stats.skills, href: "/admin/skills/items", icon: ListChecks, color: "bg-cyan-50 text-cyan-700" },
        { label: "Metrics", count: stats.metrics, href: "/admin/metrics", icon: BarChart3, color: "bg-pink-50 text-pink-600" },
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
