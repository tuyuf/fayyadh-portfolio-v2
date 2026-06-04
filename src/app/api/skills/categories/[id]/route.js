import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma.js";
import { requireAuth } from "../../../../../lib/auth.js";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const category = await prisma.skillCategory.findUnique({
            where: { id },
            include: {
                skills: {
                    where: { deletedAt: null },
                    orderBy: { sortOrder: "asc" },
                },
            },
        });

        if (!category) {
            return NextResponse.json({ error: "Skill category not found" }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error("Error fetching skill category:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const { id } = await params;
        const body = await request.json();

        const category = await prisma.skillCategory.update({
            where: { id },
            data: {
                label: body.label,
                title: body.title,
                sortOrder: body.sortOrder,
            },
        });

        revalidatePath("/");
        return NextResponse.json(category);
    } catch (error) {
        console.error("Error updating skill category:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const { id } = await params;

        await prisma.$transaction([
            prisma.skillCategory.update({
                where: { id },
                data: { deletedAt: new Date() },
            }),
            prisma.skillItem.updateMany({
                where: { categoryId: id, deletedAt: null },
                data: { deletedAt: new Date() },
            }),
        ]);

        revalidatePath("/");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting skill category:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
