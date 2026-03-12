"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Save, GripVertical } from "lucide-react";
import CloudinaryUploader from "../components/CloudinaryUploader";
import SortableList from "../components/SortableList";
import SortableItem from "../components/SortableItem";

export default function PhotosPage() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newImages, setNewImages] = useState([]);
    const [savingOrder, setSavingOrder] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchPhotos = () => {
        fetch("/api/photos")
            .then((r) => r.json())
            .then((data) => setPhotos(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleReorder = (newItems) => {
        setPhotos(newItems);
        setHasChanges(true);
    };

    const saveOrder = async () => {
        setSavingOrder(true);
        try {
            const items = photos.map((p, idx) => ({ id: p.id, sortOrder: idx }));
            await fetch("/api/reorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "photos", items }),
            });
            setHasChanges(false);
        } catch (error) {
            console.error(error);
            alert("Failed to save order");
        } finally {
            setSavingOrder(false);
        }
    };

    useEffect(() => { fetchPhotos(); }, []);

    const handleUpload = async () => {
        if (newImages.length === 0) return;
        setUploading(true);
        try {
            const res = await fetch("/api/photos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newImages),
            });
            if (res.ok) {
                setNewImages([]);
                fetchPhotos();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this photo?")) return;
        await fetch(`/api/photos/${id}`, { method: "DELETE" });
        setPhotos((p) => p.filter((x) => x.id !== id));
    };

    if (loading) return <div className="text-gray-400 py-20 text-center">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-heading mb-2">Photography</h1>
                    <p className="text-gray-500 text-sm">Manage your photography gallery.</p>
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

            {/* Upload Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
                <h2 className="text-lg font-heading mb-4">Add Photos</h2>
                <CloudinaryUploader images={newImages} onChange={setNewImages} folder="portfolio/photography" />
                {newImages.length > 0 && (
                    <button onClick={handleUpload} disabled={uploading} className="mt-4 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 cursor-pointer">
                        {uploading ? "Saving..." : `Save ${newImages.length} Photo(s)`}
                    </button>
                )}
            </div>

            {/* Existing Photos Grid */}
            {photos.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-xl py-16 text-center text-gray-400">
                    No photos yet. Upload some above!
                </div>
            ) : (
                <SortableList
                    items={photos}
                    onReorder={handleReorder}
                    strategy="grid"
                    className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
                    renderItem={(photo) => (
                        <SortableItem key={photo.id} id={photo.id} useHandle={false}>
                            <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white aspect-square cursor-move active:cursor-grabbing">
                                <img src={photo.imageUrl} alt={photo.caption || "photo"} className="w-full h-full object-cover pointer-events-none" />
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(photo.id); }} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10 hover:bg-red-600">
                                    <Trash2 size={12} />
                                </button>
                                <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    <GripVertical size={12} />
                                </div>
                            </div>
                        </SortableItem>
                    )}
                />
            )}
        </div>
    );
}
