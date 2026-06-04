"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditSkillItemPage({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ categoryId: "", name: "", level: 1 });

    useEffect(() => {
        Promise.all([fetch(`/api/skills/items/${id}`), fetch("/api/skills/categories")])
            .then(async ([itemRes, categoriesRes]) => {
                if (!itemRes.ok) {
                    throw new Error("Item not found");
                }

                const [itemData, categoriesData] = await Promise.all([itemRes.json(), categoriesRes.json()]);
                setCategories(categoriesData);
                setForm({
                    name: itemData.name || "",
                    categoryId: itemData.categoryId || categoriesData[0]?.id || "",
                    level: itemData.level ?? 1,
                });
            })
            .catch(() => setNotFound(true))
            .finally(() => setFetching(false));
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/skills/items/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update skill");
            }

            router.push("/admin/skills/items");
            router.refresh();
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="text-center py-20 text-gray-500">Loading...</div>;
    }

    if (notFound) {
        return <div className="text-center py-20 text-red-500">Skill item not found</div>;
    }

    return (
        <div className="max-w-3xl">
            <Link href="/admin/skills/items" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-6 text-sm transition-colors">
                <ArrowLeft size={16} /> Back to Skill Items
            </Link>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h1 className="text-2xl font-heading mb-6">Edit Skill Item</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 cursor-pointer"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
