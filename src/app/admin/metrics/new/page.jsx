"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewMetricPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        label: "",
        value: "",
        suffix: "",
        description: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/metrics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create metric");
            }

            router.push("/admin/metrics");
            router.refresh();
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <Link href="/admin/metrics" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-6 text-sm transition-colors">
                <ArrowLeft size={16} /> Back to Metrics
            </Link>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h1 className="text-2xl font-heading mb-6">New Metric</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Label *</label>
                        <input
                            required
                            name="label"
                            value={form.label}
                            onChange={handleChange}
                            placeholder="e.g. Years Experience"
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Value *</label>
                        <input
                            required
                            name="value"
                            value={form.value}
                            onChange={handleChange}
                            placeholder="e.g. 5+"
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Suffix</label>
                        <input
                            name="suffix"
                            value={form.suffix}
                            onChange={handleChange}
                            placeholder="e.g. clients, projects (optional)"
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="e.g. smalltribe was officially founded in February 2022..."
                            rows={3}
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black resize-none"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 cursor-pointer"
                    >
                        {loading ? "Saving..." : "Create Metric"}
                    </button>
                </form>
            </div>
        </div>
    );
}
