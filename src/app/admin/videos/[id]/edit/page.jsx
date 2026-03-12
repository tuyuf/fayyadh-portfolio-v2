"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditVideo({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        title: "",
        url: "",
        description: "",
    });

    useEffect(() => {
        fetch(`/api/videos/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Not found");
                return res.json();
            })
            .then(data => {
                setForm({
                    title: data.title,
                    url: data.url,
                    description: data.description || "",
                });
            })
            .catch(err => setError("Video not found"))
            .finally(() => setFetching(false));
    }, [id]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            const res = await fetch(`/api/videos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                router.push("/admin/videos");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to update video");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="text-center py-20 text-gray-500">Loading...</div>;
    if (error && fetching === false) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <div className="max-w-3xl">
            <Link href="/admin/videos" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-6 text-sm transition-colors">
                <ArrowLeft size={16} /> Back to Videos
            </Link>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h1 className="text-2xl font-heading mb-6">Edit Video</h1>

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
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button type="submit" disabled={loading} className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 cursor-pointer">
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
