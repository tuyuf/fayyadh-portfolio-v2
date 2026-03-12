"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CloudinaryUploader from "../../components/CloudinaryUploader";

export default function NewCaseStudy() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        credits: "",
        description: "",
        link: "",
        category: "uiux",
    });
    const [images, setImages] = useState([]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (images.length < 5) {
            setError("Please upload at least 5 images.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/casestudies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, images }),
            });

            if (res.ok) {
                router.push("/admin/casestudies");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to create project");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <Link href="/admin/casestudies" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-6 text-sm transition-colors">
                <ArrowLeft size={16} /> Back to Case Studies
            </Link>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h1 className="text-2xl font-heading mb-6">New Case Study</h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                            <input required name="title" value={form.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
                            <input name="subtitle" value={form.subtitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black" placeholder="e.g. Full Rebrand" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                            <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black bg-white">
                                <option value="uiux">UI / UX Design</option>
                                <option value="brand">Brand & Identity</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Credits</label>
                            <input name="credits" value={form.credits} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black" placeholder="e.g. Credits: Studio, Designer" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                        <textarea required name="description" rows={4} value={form.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">External Link (optional)</label>
                        <input name="link" value={form.link} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black" placeholder="https://..." />
                    </div>

                    <div className="pt-4 border-t">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Project Images * <span className="text-gray-400 font-normal">(minimum 5)</span>
                        </label>
                        <CloudinaryUploader images={images} onChange={setImages} folder="portfolio/casestudies" />
                        {images.length > 0 && images.length < 5 && (
                            <p className="text-amber-600 text-xs mt-2">You need at least {5 - images.length} more image(s).</p>
                        )}
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-60 cursor-pointer">
                        {loading ? "Publishing..." : "Publish Project"}
                    </button>
                </form>
            </div>
        </div>
    );
}
