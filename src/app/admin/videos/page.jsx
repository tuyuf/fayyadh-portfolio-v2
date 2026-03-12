"use client";

import { useState, useEffect } from "react";
import { Trash2, Pencil, Save, GripVertical } from "lucide-react";
import Link from "next/link";
import SortableList from "../components/SortableList";
import SortableItem from "../components/SortableItem";

export default function VideosPage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ title: "", url: "", description: "" });
    const [savingOrder, setSavingOrder] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const fetchVideos = () => {
        fetch("/api/videos")
            .then((r) => r.json())
            .then((data) => setVideos(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleReorder = (newItems) => {
        setVideos(newItems);
        setHasChanges(true);
    };

    const saveOrder = async () => {
        setSavingOrder(true);
        try {
            const items = videos.map((v, idx) => ({ id: v.id, sortOrder: idx }));
            await fetch("/api/reorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "videos", items }),
            });
            setHasChanges(false);
        } catch (error) {
            console.error(error);
            alert("Failed to save order");
        } finally {
            setSavingOrder(false);
        }
    };

    useEffect(() => { fetchVideos(); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/videos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setForm({ title: "", url: "", description: "" });
                fetchVideos();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this video?")) return;
        await fetch(`/api/videos/${id}`, { method: "DELETE" });
        setVideos((v) => v.filter((x) => x.id !== id));
    };

    // Extract YouTube thumbnail
    const getThumb = (url) => {
        const match = url?.match(/(?:youtu\.be\/|v=)([^&#?]+)/);
        return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
    };

    if (loading) return <div className="text-gray-400 py-20 text-center">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-heading mb-2">Videography</h1>
                    <p className="text-gray-500 text-sm">Manage your video links.</p>
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

            {/* Add Video Form */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
                <h2 className="text-lg font-heading mb-4">Add Video</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                            <input required name="title" value={form.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">YouTube / Vimeo URL *</label>
                            <input required name="url" value={form.url} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black" placeholder="https://youtu.be/..." />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <input name="description" value={form.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black" />
                    </div>
                    <button type="submit" disabled={saving} className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 cursor-pointer">
                        {saving ? "Saving..." : "Add Video"}
                    </button>
                </form>
            </div>

            {/* Video List */}
            {videos.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-xl py-16 text-center text-gray-400">
                    No videos yet. Add one above!
                </div>
            ) : (
                <SortableList
                    items={videos}
                    onReorder={handleReorder}
                    strategy="grid"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    renderItem={(v) => {
                        const thumb = getThumb(v.url);
                        return (
                            <SortableItem key={v.id} id={v.id} useHandle={false}>
                                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden group cursor-move active:cursor-grabbing">
                                    <div className="relative">
                                        {thumb && <img src={thumb} alt={v.title} className="w-full h-36 object-cover pointer-events-none" />}
                                        <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            <GripVertical size={12} />
                                        </div>
                                    </div>
                                    <div className="p-4 flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-sm">{v.title}</p>
                                            {v.description && <p className="text-xs text-gray-400 mt-1">{v.description}</p>}
                                        </div>
                                        <div className="flex gap-1">
                                            <Link href={`/admin/videos/${v.id}/edit`} onClick={(e) => e.stopPropagation()} className="text-gray-500 hover:bg-gray-50 p-1.5 rounded-lg transition-colors cursor-pointer z-10">
                                                <Pencil size={14} />
                                            </Link>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(v.id); }} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer z-10">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </SortableItem>
                        );
                    }}
                />
            )}
        </div>
    );
}
