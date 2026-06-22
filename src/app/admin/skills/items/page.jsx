"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import SortableList from "../../components/SortableList";
import SortableItem from "../../components/SortableItem";

export default function SkillItemsPage() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingOrder, setSavingOrder] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [form, setForm] = useState({ categoryId: "", name: "", level: 1 });

    const fetchData = async () => {
        try {
            const [itemsResponse, categoriesResponse] = await Promise.all([
                fetch("/api/skills/items"),
                fetch("/api/skills/categories"),
            ]);

            const [itemsData, categoriesData] = await Promise.all([
                itemsResponse.json(),
                categoriesResponse.json(),
            ]);

            setItems(itemsData);
            setCategories(categoriesData);
            setForm((prev) => ({
                ...prev,
                categoryId: prev.categoryId || categoriesData[0]?.id || "",
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredItems = useMemo(() => {
        if (selectedCategory === "all") return items;
        return items.filter((item) => item.categoryId === selectedCategory);
    }, [items, selectedCategory]);

    const handleReorder = (newItems) => {
        if (selectedCategory === "all") {
            return;
        }

        const remaining = items.filter((item) => item.categoryId !== selectedCategory);
        setItems([...remaining, ...newItems]);
        setHasChanges(true);
    };

    const saveOrder = async () => {
        if (selectedCategory === "all") {
            alert("Select a category first to reorder skills");
            return;
        }

        setSavingOrder(true);
        try {
            const payload = filteredItems.map((item, index) => ({ id: item.id, sortOrder: index }));
            await fetch("/api/reorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "skillitems", items: payload }),
            });
            setHasChanges(false);
            fetchData();
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
            const response = await fetch("/api/skills/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error("Failed to create skill item");
            }

            setForm((prev) => ({ ...prev, name: "", level: 1 }));
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Failed to create skill item");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this skill item?")) return;
        await fetch(`/api/skills/items/${id}`, { method: "DELETE" });
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    if (loading) {
        return <div className="text-gray-400 py-20 text-center">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-heading mb-2">Skill Items</h1>
                    <p className="text-gray-500 text-sm">Manage individual skills in each category.</p>
                </div>
                {hasChanges && selectedCategory !== "all" && (
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
                <h2 className="text-lg font-heading mb-4">Add Skill Item</h2>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                        <select
                            required
                            value={form.categoryId}
                            onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Skill Name *</label>
                        <input
                            required
                            value={form.name}
                            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                            placeholder="e.g. Next.js"
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Level (1–3) *</label>
                        <select
                            required
                            value={form.level}
                            onChange={(event) => setForm((prev) => ({ ...prev, level: parseInt(event.target.value, 10) }))}
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        >
                            <option value={1}>1 — Basic</option>
                            <option value={2}>2 — Intermediate</option>
                            <option value={3}>3 — Advanced</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="md:col-span-3 justify-self-start bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 cursor-pointer inline-flex items-center gap-2"
                    >
                        <Plus size={16} /> {saving ? "Adding..." : "Add Skill"}
                    </button>
                </form>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
                <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${selectedCategory === "all" ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                    All
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${selectedCategory === category.id ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            {selectedCategory === "all" && (
                <p className="text-xs text-gray-400 mb-4">Choose a category filter to reorder skills.</p>
            )}

            {filteredItems.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-xl py-16 text-center text-gray-400">
                    No skills found for this category.
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50 border-b flex px-4 py-3 text-sm text-gray-500 font-medium whitespace-nowrap">
                        <div className="w-10 flex-shrink-0"></div>
                        <div className="w-72">Skill Name</div>
                        <div className="flex-1">Category</div>
                        <div className="w-20">Level</div>
                        <div className="w-28 text-right">Actions</div>
                    </div>

                    <SortableList
                        items={filteredItems}
                        onReorder={handleReorder}
                        className="divide-y divide-gray-100"
                        renderItem={(item) => (
                            <SortableItem key={item.id} id={item.id} className="hover:bg-gray-50 transition-colors">
                                <div className="flex-1 flex items-center py-3 pr-4">
                                    <div className="w-72 text-sm text-gray-900 truncate pr-4">{item.name}</div>
                                    <div className="flex-1 min-w-0 text-sm text-gray-500 truncate pr-4">{item.category?.label || "-"}</div>
                                    <div className="w-20 text-sm text-gray-700">{item.level ?? 1}</div>
                                    <div className="w-28 text-right flex justify-end gap-1">
                                        <Link href={`/admin/skills/items/${item.id}/edit`} className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer" title="Edit">
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
