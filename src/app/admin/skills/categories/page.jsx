"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import SortableList from "../../components/SortableList";
import SortableItem from "../../components/SortableItem";

export default function SkillCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingOrder, setSavingOrder] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [form, setForm] = useState({ label: "", title: "" });

    const fetchCategories = () => {
        fetch("/api/skills/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleReorder = (newItems) => {
        setCategories(newItems);
        setHasChanges(true);
    };

    const saveOrder = async () => {
        setSavingOrder(true);
        try {
            const items = categories.map((item, index) => ({ id: item.id, sortOrder: index }));
            await fetch("/api/reorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "skillcategories", items }),
            });
            setHasChanges(false);
        } catch (error) {
            console.error(error);
            alert("Failed to save order");
        } finally {
            setSavingOrder(false);
        }
    };

    const handleCreate = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const response = await fetch("/api/skills/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error("Failed to create category");
            }

            setForm({ label: "", title: "" });
            fetchCategories();
        } catch (error) {
            console.error(error);
            alert("Failed to create category");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this category and its skills?")) return;

        await fetch(`/api/skills/categories/${id}`, { method: "DELETE" });
        setCategories((prev) => prev.filter((item) => item.id !== id));
    };

    if (loading) {
        return <div className="text-gray-400 py-20 text-center">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-heading mb-2">Skill Categories</h1>
                    <p className="text-gray-500 text-sm">Group skills into sections like Creative Arsenal and Tech Stack.</p>
                </div>
                {hasChanges && (
                    <button
                        onClick={saveOrder}
                        disabled={savingOrder}
                        className="bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors text-sm disabled:opacity-50 cursor-pointer"
                    >
                        {savingOrder ? "Saving..." : <><Save size={16} /> Save Order</>}
                    </button>
                )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
                <h2 className="text-lg font-heading mb-4">Add Category</h2>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Label *</label>
                        <input
                            required
                            value={form.label}
                            onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))}
                            placeholder="e.g. Creative Arsenal"
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                        <input
                            required
                            value={form.title}
                            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                            placeholder="e.g. Design Tools"
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="md:col-span-2 justify-self-start bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 cursor-pointer inline-flex items-center gap-2"
                    >
                        <Plus size={16} /> {saving ? "Adding..." : "Add Category"}
                    </button>
                </form>
            </div>

            {categories.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-xl py-16 text-center text-gray-400">
                    No categories yet. Add one above.
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50 border-b flex px-4 py-3 text-sm text-gray-500 font-medium whitespace-nowrap">
                        <div className="w-10 flex-shrink-0"></div>
                        <div className="w-64">Label</div>
                        <div className="flex-1">Title</div>
                        <div className="w-20 text-center">Skills</div>
                        <div className="w-28 text-right">Actions</div>
                    </div>

                    <SortableList
                        items={categories}
                        onReorder={handleReorder}
                        className="divide-y divide-gray-100"
                        renderItem={(item) => (
                            <SortableItem key={item.id} id={item.id} className="hover:bg-gray-50 transition-colors">
                                <div className="flex-1 flex items-center py-3 pr-4">
                                    <div className="w-64 text-sm text-gray-900 truncate pr-4">{item.label}</div>
                                    <div className="flex-1 min-w-0 text-sm text-gray-500 truncate pr-4">{item.title}</div>
                                    <div className="w-20 text-center text-xs text-gray-500">{item.skills?.length || 0}</div>
                                    <div className="w-28 text-right flex justify-end gap-1">
                                        <Link href={`/admin/skills/categories/${item.id}/edit`} className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer" title="Edit">
                                            <Pencil size={16} />
                                        </Link>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer" title="Delete">
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
