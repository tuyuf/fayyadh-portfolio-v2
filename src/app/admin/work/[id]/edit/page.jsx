"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditWorkPage({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        year: "",
        company: "",
        position: "",
    });

    useEffect(() => {
        fetch(`/api/work/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Not found");
                return res.json();
            })
            .then((data) => {
                setForm({
                    year: data.year || "",
                    company: data.company || "",
                    position: data.position || "",
                });
            })
            .catch(() => setNotFound(true))
            .finally(() => setFetching(false));
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/work/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update work item");
            }

            router.push("/admin/work");
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
        return <div className="text-center py-20 text-red-500">Work item not found</div>;
    }

    return (
        <div className="max-w-3xl">
            <Link href="/admin/work" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-6 text-sm transition-colors">
                <ArrowLeft size={16} /> Back to Work
            </Link>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h1 className="text-2xl font-heading mb-6">Edit Work Item</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Year *</label>
                        <input
                            required
                            name="year"
                            value={form.year}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Company *</label>
                        <input
                            required
                            name="company"
                            value={form.company}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Position *</label>
                        <input
                            required
                            name="position"
                            value={form.position}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />
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
