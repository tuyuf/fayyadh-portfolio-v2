"use client";

import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud, X, GripVertical } from "lucide-react";
import SortableList from "./SortableList";
import SortableItem from "./SortableItem";

/**
 * Reusable Cloudinary uploader component.
 * Props:
 * - images: array of { imageUrl, cloudinaryId }
 * - onChange: called with updated array
 * - multiple: boolean (default true)
 * - folder: cloudinary folder (default "portfolio")
 */
export default function CloudinaryUploader({
    images = [],
    onChange,
    multiple = true,
    folder = "portfolio",
}) {
    const handleSuccess = (result) => {
        if (result.event === "success" && result.info) {
            const newImage = {
                imageUrl: result.info.secure_url,
                cloudinaryId: result.info.public_id,
            };
            // Use functional state updater to avoid stale closures during rapid multiple uploads
            onChange((prevImages) => [...prevImages, newImage]);
        }
    };

    const removeImage = (index) => {
        onChange(images.filter((_, i) => i !== index));
    };

    const handleReorder = (newItems) => {
        onChange(newItems);
    };

    return (
        <div>
            <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
                options={{
                    folder,
                    multiple,
                    maxFiles: 20,
                    resourceType: "image",
                }}
                onSuccess={handleSuccess}
            >
                {({ open }) => (
                    <button
                        type="button"
                        onClick={() => open()}
                        className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-black transition-all group cursor-pointer"
                    >
                        <UploadCloud
                            size={24}
                            className="mb-2 group-hover:text-black transition-colors"
                        />
                        <span className="font-medium group-hover:text-black transition-colors">
                            Upload Images to Cloudinary
                        </span>
                        <span className="text-xs mt-1 text-gray-400">
                            Click to browse or drag and drop
                        </span>
                    </button>
                )}
            </CldUploadWidget>

            {images.length > 0 && (
                <SortableList
                    items={images}
                    onReorder={handleReorder}
                    strategy="grid"
                    idProp="cloudinaryId"
                    className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3"
                    renderItem={(img, idx) => (
                        <SortableItem key={img.cloudinaryId} id={img.cloudinaryId} useHandle={false}>
                            <div className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square cursor-move active:cursor-grabbing bg-gray-50">
                                <img
                                    src={img.imageUrl}
                                    alt="upload"
                                    className="w-full h-full object-cover pointer-events-none"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeImage(images.indexOf(img)); }}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                                >
                                    <X size={12} />
                                </button>
                                <div className="absolute top-1 left-1 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    <GripVertical size={12} />
                                </div>
                                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 text-center truncate">
                                    {images.indexOf(img) + 1}
                                </span>
                            </div>
                        </SortableItem>
                    )}
                />
            )}
        </div>
    );
}
