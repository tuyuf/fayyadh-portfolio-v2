"use client";

import { useState, useEffect } from "react";
import { Trash2, Pencil, Save, GripVertical, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import SortableList from "../components/SortableList";
import SortableItem from "../components/SortableItem";
import CloudinaryUploader from "../components/CloudinaryUploader";

export default function WebProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ title: "", description: "", techStack: "", projectUrl: "", embedUrl: "" });
    const [thumbnail, setThumbnail] = useState(null);
    const [savingOrder, setSavingOrder] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const fetchProjects = () => {
        fetch("/api/webprojects")
            .then((r) => r.json())
            .then((data) => setProjects(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleReorder = (newItems) => {
        setProjects(newItems);
        setHasChanges(true);
    };

    const saveOrder = async () => {
        setSavingOrder(true);
        try {
            const items = projects.map((p, idx) => ({ id: p.id, sortOrder: idx }));
            await fetch("/api/reorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "webprojects", items }),
            });
            setHasChanges(false);
        } catch (error) {
            console.error(error);
            alert("Failed to save order");
        } finally {
            setSavingOrder(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Convert comma-separated tech stack to array
            const techArray = form.techStack.split(",").map((s) => s.trim()).filter(Boolean);

            const res = await fetch("/api/webprojects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    techStack: techArray,
                    projectUrl: form.projectUrl || null,
                    embedUrl: form.embedUrl || null,
                    thumbnailUrl: thumbnail?.imageUrl || null,
                    cloudinaryId: thumbnail?.cloudinaryId || null,
                }),
            });

            if (res.ok) {
                setForm({ title: "", description: "", techStack: "", projectUrl: "", embedUrl: "" });
                setThumbnail(null);
                fetchProjects();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this project?")) return;
        await fetch(`/api/webprojects/${id}`, { method: "DELETE" });
        setProjects((p) => p.filter((x) => x.id !== id));
    };

    if (loading) return <div className="text-gray-400 py-20 text-center">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-heading mb-2">Web Development</h1>
                    <p className="text-gray-500 text-sm">Manage your web development projects.</p>
                </div>
                {hasChanges && (
                    <button 
                        onClick={saveOrder} 
                        disabled={savingOrder}
                        className="bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors text-sm disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                        {savingOrder ? "Saving..." : <><Save size={16} /> Save Order</>}
                    </button>
                )}
            </div>

            {/* Add Project Form */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
                <h2 className="text-lg font-heading mb-4">Add Web Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                            <input required name="title" value={form.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tech Stack *</label>
                            <input required name="techStack" value={form.techStack} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black" placeholder="Next.js, Tailwind, PostgreSQL" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                        <textarea required name="description" rows={3} value={form.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Project URL</label>
                            <input name="projectUrl" value={form.projectUrl} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Embed URL (for iframe preview)</label>
                            <input name="embedUrl" value={form.embedUrl} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black" placeholder="https://..." />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail Preview</label>
                        <CloudinaryUploader 
                            images={thumbnail ? [thumbnail] : []} 
                            onChange={(val) => {
                                if (typeof val === 'function') {
                                    setThumbnail(prev => {
                                        const results = val(prev ? [prev] : []);
                                        return results.length > 0 ? results[0] : null;
                                    });
                                } else {
                                    setThumbnail(val.length > 0 ? val[0] : null);
                                }
                            }} 
                            folder="portfolio/webprojects"
                            maxFiles={1}
                        />
                    </div>
                    <button type="submit" disabled={saving} className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 cursor-pointer">
                        {saving ? "Saving..." : "Add Project"}
                    </button>
                </form>
            </div>

            {/* Project List */}
            {projects.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-xl py-16 text-center text-gray-400">
                    No web projects yet. Add one above!
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="bg-gray-50 border-b flex px-4 py-3 text-sm text-gray-500 font-medium whitespace-nowrap">
                        <div className="w-10 flex-shrink-0"></div> {/* Grip space */}
                        <div className="flex-1">Title</div>
                        <div className="w-48 hidden md:block">Tech Stack</div>
                        <div className="w-48 hidden lg:block">URL</div>
                        <div className="w-32 text-right">Actions</div>
                    </div>

                    <SortableList
                        items={projects}
                        onReorder={handleReorder}
                        className="divide-y divide-gray-100"
                        renderItem={(p) => (
                            <SortableItem key={p.id} id={p.id} className="hover:bg-gray-50 transition-colors">
                                <div className="flex-1 flex items-center py-3 pr-4">
                                    <div className="w-12 h-12 rounded bg-gray-100 mr-3 overflow-hidden flex-shrink-0 border border-gray-200">
                                        {p.thumbnailUrl ? (
                                            <img src={p.thumbnailUrl} alt={p.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 pr-4 font-medium text-sm text-gray-900 truncate">
                                        {p.title}
                                    </div>
                                    <div className="w-48 hidden md:block text-xs text-gray-500 truncate pr-4">
                                        {Array.isArray(p.techStack) ? p.techStack.join(" • ") : p.techStack}
                                    </div>
                                    <div className="w-48 hidden lg:block text-xs text-gray-400 truncate pr-4">
                                        {p.projectUrl || "—"}
                                    </div>
                                    <div className="w-32 text-right flex justify-end gap-1">
                                        <Link href={`/admin/webprojects/${p.id}/edit`} className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer">
                                            <Pencil size={14} />
                                        </Link>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer">
                                            <Trash2 size={14} />
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
