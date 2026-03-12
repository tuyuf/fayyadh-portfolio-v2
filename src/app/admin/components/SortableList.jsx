"use client";

import React from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";

/**
 * Shared Sortable List component
 * @param {Array} items - The items to display
 * @param {Function} onReorder - Callback when reordering is done (returns new array)
 * @param {Function} renderItem - Function to render each sortable item
 * @param {String} strategy - "vertical" or "grid"
 * @param {String} className - Optional className for the container
 */
export default function SortableList({
    items,
    onReorder,
    renderItem,
    strategy = "vertical",
    className = "",
    idProp = "id",
    as: Component = "div",
}) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item[idProp] === active.id);
            const newIndex = items.findIndex((item) => item[idProp] === over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);
            onReorder(newItems);
        }
    };

    const sortingStrategy = strategy === "grid" ? rectSortingStrategy : verticalListSortingStrategy;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToFirstScrollableAncestor]}
        >
            <SortableContext items={items.map((item) => item[idProp])} strategy={sortingStrategy}>
                <Component className={className}>
                    {items.map((item) => renderItem(item))}
                </Component>
            </SortableContext>
        </DndContext>
    );
}
