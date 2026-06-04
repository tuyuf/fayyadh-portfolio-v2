"use client";

import { useEffect, useState } from "react";
import CloudinaryUploader from "../components/CloudinaryUploader";

const initialForm = {
    name: "",
    role: "",
    email: "",
    phone: "",
    birthDate: "",
    motto: "",
    aboutText: "",
};

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        fetch("/api/profile")
            .then((res) => res.json())
            .then((data) => {
                if (!data) return;
                setForm({
                    name: data.name || "",
                    role: data.role || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    birthDate: data.birthDate || "",
                    motto: data.motto || "",
                    aboutText: data.aboutText || "",
                });

                if (data.photoUrl) {
                    setPhoto({
                        imageUrl: data.photoUrl,
                        cloudinaryId: data.photoCloudinaryId,
                    });
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);

        try {
            const response = await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    photoUrl: photo?.imageUrl || null,
                    photoCloudinaryId: photo?.cloudinaryId || null,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save profile");
            }

            alert("Profile saved successfully");
        } catch (error) {
            console.error(error);
            alert("Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-gray-400 py-20 text-center">Loading...</div>;
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-heading mb-2">Profile</h1>
                <p className="text-gray-500 text-sm">Manage profile, bio, and profile photo for About section.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                            <input
                                required
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role *</label>
                            <input
                                required
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Birth Date</label>
                            <input
                                name="birthDate"
                                value={form.birthDate}
                                onChange={handleChange}
                                placeholder="e.g. 2003-07-12"
                                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Motto</label>
                        <textarea
                            rows={2}
                            name="motto"
                            value={form.motto}
                            onChange={handleChange}
                            placeholder="Short motto or tagline for the intro section"
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">About Text *</label>
                        <textarea
                            required
                            rows={6}
                            name="aboutText"
                            value={form.aboutText}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Profile Photo</label>
                        <CloudinaryUploader
                            images={photo ? [photo] : []}
                            onChange={(val) => {
                                if (typeof val === "function") {
                                    setPhoto((prev) => {
                                        const results = val(prev ? [prev] : []);
                                        return results.length > 0 ? results[0] : null;
                                    });
                                    return;
                                }

                                setPhoto(val.length > 0 ? val[0] : null);
                            }}
                            multiple={false}
                            folder="portfolio/profile"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 cursor-pointer"
                    >
                        {saving ? "Saving..." : "Save Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}
