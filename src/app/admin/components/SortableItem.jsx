"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

/**
 * Shared Sortable Item wrapper
 * @param {String} id - Unique identifier for the item
 * @param {React.ReactNode} children - The actual content
 * @param {Boolean} useHandle - If true, dragging only works through the handle
 */
export default function SortableItem({ id, children, useHandle = true, className = "", as: Component = "div" }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 0,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Component ref={setNodeRef} style={style} className={`${className} ${isDragging ? "shadow-lg bg-white" : ""}`}>
            <div className="flex items-center gap-2 w-full h-full">
                {useHandle && (
                    <button
                        type="button"
                        className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                        {...attributes}
                        {...listeners}
                    >
                        <GripVertical size={18} />
                    </button>
                )}
                <div 
                    className="flex-1 flex items-center min-w-0 h-full" 
                    {...(!useHandle ? { ...attributes, ...listeners } : {})}
                >
                    {children}
                </div>
            </div>
        </Component>
    );
}
