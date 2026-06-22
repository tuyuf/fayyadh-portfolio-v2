import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../lib/prisma.js";
import { requireAuth } from "../../../../lib/auth.js";

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const item = await prisma.workItem.findUnique({ where: { id } });

        if (!item) {
            return NextResponse.json({ error: "Work item not found" }, { status: 404 });
        }

        return NextResponse.json(item);
    } catch (error) {
        console.error("Error fetching work item:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const { id } = await params;
        const body = await request.json();

        const item = await prisma.workItem.update({
            where: { id },
            data: {
                year: body.year,
                company: body.company,
                position: body.position,
                sortOrder: body.sortOrder,
            },
        });

        revalidatePath("/");
        return NextResponse.json(item);
    } catch (error) {
        console.error("Error updating work item:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const { id } = await params;
        await prisma.workItem.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        revalidatePath("/");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting work item:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
