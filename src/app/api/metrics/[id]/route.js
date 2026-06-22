import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../lib/prisma.js";
import { requireAuth } from "../../../../lib/auth.js";

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const metric = await prisma.metric.findUnique({ where: { id } });

        if (!metric) {
            return NextResponse.json({ error: "Metric not found" }, { status: 404 });
        }

        return NextResponse.json(metric);
    } catch (error) {
        console.error("Error fetching metric:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const { id } = await params;
        const body = await request.json();

        const metric = await prisma.metric.update({
            where: { id },
            data: {
                label: body.label,
                value: body.value,
                suffix: body.suffix,
                description: body.description,
                sortOrder: body.sortOrder,
            },
        });

        revalidatePath("/");
        return NextResponse.json(metric);
    } catch (error) {
        console.error("Error updating metric:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const { id } = await params;
        await prisma.metric.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        revalidatePath("/");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting metric:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
