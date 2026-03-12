"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil, Save, Check } from "lucide-react";
import SortableList from "../components/SortableList";
import SortableItem from "../components/SortableItem";

export default function CaseStudiesPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        fetch("/api/casestudies")
            .then((r) => r.json())
            .then((data) => setProjects(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleReorder = (newItems) => {
        setProjects(newItems);
        setHasChanges(true);
    };

    const saveOrder = async () => {
        setSaving(true);
        try {
            const items = projects.map((p, idx) => ({ id: p.id, sortOrder: idx }));
            await fetch("/api/reorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "casestudies", items }),
            });
            setHasChanges(false);
        } catch (error) {
            console.error(error);
            alert("Failed to save order");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this project and all its images?")) return;
        await fetch(`/api/casestudies/${id}`, { method: "DELETE" });
        setProjects((p) => p.filter((x) => x.id !== id));
    };

    const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);

    if (loading) return <div className="text-gray-400 py-20 text-center">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-heading mb-2">Case Studies</h1>
                    <p className="text-gray-500 text-sm">UI/UX Design & Brand Identity projects.</p>
                </div>
                <div className="flex gap-2">
                    {hasChanges && (
                        <button 
                            onClick={saveOrder} 
                            disabled={saving}
                            className="bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors text-sm disabled:opacity-50 cursor-pointer"
                        >
                            {saving ? "Saving..." : <><Save size={16} /> Save Order</>}
                        </button>
                    )}
                    <Link href="/admin/casestudies/new" className="bg-black text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors text-sm">
                        <Plus size={16} /> New Project
                    </Link>
                </div>
            </div>

            <div className="flex gap-2 mb-6">
                {["all", "uiux", "brand"].map((f) => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${filter === f ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        {f === "all" ? "All" : f === "uiux" ? "UI/UX" : "Brand"}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-xl py-20 text-center text-gray-400">
                    No projects yet. <Link href="/admin/casestudies/new" className="text-black underline">Create one</Link>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="bg-gray-50 border-b flex px-4 py-3 text-sm text-gray-500 font-medium whitespace-nowrap">
                        <div className="w-10 flex-shrink-0"></div> {/* Grip space */}
                        <div className="flex-1">Title</div>
                        <div className="w-32 hidden md:block">Category</div>
                        <div className="w-20 hidden sm:block text-center">Images</div>
                        <div className="w-32 text-right">Actions</div>
                    </div>

                    <SortableList
                        items={filtered}
                        onReorder={handleReorder}
                        className="divide-y divide-gray-100"
                        renderItem={(p) => (
                            <SortableItem key={p.id} id={p.id} className="hover:bg-gray-50 transition-colors">
                                <div className="flex-1 flex items-center py-3 pr-4">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <p className="font-medium text-sm text-gray-900 truncate">{p.title}</p>
                                        {p.subtitle && <p className="text-xs text-gray-400 truncate">{p.subtitle}</p>}
                                    </div>
                                    <div className="w-32 hidden md:block">
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${p.category === "uiux" ? "bg-purple-50 text-purple-600" : "bg-amber-50 text-amber-700"}`}>
                                            {p.category === "uiux" ? "UI/UX" : "Brand"}
                                        </span>
                                    </div>
                                    <div className="w-20 hidden sm:block text-center text-xs text-gray-500 font-medium">
                                        {p.images?.length || 0}
                                    </div>
                                    <div className="w-32 text-right flex justify-end gap-1">
                                        <Link href={`/admin/casestudies/${p.id}/edit`} className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer" title="Edit">
                                            <Pencil size={16} />
                                        </Link>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </SortableItem>
                        )}
                    />
                </div>
            )}
        </div>
    );
}
