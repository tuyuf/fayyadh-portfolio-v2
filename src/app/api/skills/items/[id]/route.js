import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma.js";
import { requireAuth } from "../../../../../lib/auth.js";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const item = await prisma.skillItem.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });

        if (!item) {
            return NextResponse.json({ error: "Skill item not found" }, { status: 404 });
        }

        return NextResponse.json(item);
    } catch (error) {
        console.error("Error fetching skill item:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const { id } = await params;
        const body = await request.json();

        const item = await prisma.skillItem.update({
            where: { id },
            data: {
                name: body.name,
                categoryId: body.categoryId,
                level: body.level,
                sortOrder: body.sortOrder,
            },
            include: {
                category: true,
            },
        });

        revalidatePath("/");
        return NextResponse.json(item);
    } catch (error) {
        console.error("Error updating skill item:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const { id } = await params;
        await prisma.skillItem.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        revalidatePath("/");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting skill item:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
