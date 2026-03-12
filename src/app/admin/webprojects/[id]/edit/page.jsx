"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import CloudinaryUploader from "../../../components/CloudinaryUploader";

export default function EditWebProject({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({ 
        title: "", 
        description: "", 
        techStack: "", 
        projectUrl: "", 
        embedUrl: "" 
    });
    const [thumbnail, setThumbnail] = useState(null);

    useEffect(() => {
        fetch(`/api/webprojects/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Not found");
                return res.json();
            })
            .then(data => {
                setForm({
                    title: data.title,
                    description: data.description || "",
                    techStack: Array.isArray(data.techStack) ? data.techStack.join(", ") : (data.techStack || ""),
                    projectUrl: data.projectUrl || "",
                    embedUrl: data.embedUrl || "",
                });
                if (data.thumbnailUrl) {
                    setThumbnail({ imageUrl: data.thumbnailUrl, cloudinaryId: data.cloudinaryId });
                }
            })
            .catch(err => setError("Project not found"))
            .finally(() => setFetching(false));
    }, [id]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            const techArray = form.techStack.split(",").map((s) => s.trim()).filter(Boolean);

            const res = await fetch(`/api/webprojects/${id}`, {
                method: "PUT",
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
                router.push("/admin/webprojects");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to update project");
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
            <Link href="/admin/webprojects" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-6 text-sm transition-colors">
                <ArrowLeft size={16} /> Back to Web Projects
            </Link>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h1 className="text-2xl font-heading mb-6">Edit Web Project</h1>

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

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button type="submit" disabled={loading} className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 cursor-pointer">
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
