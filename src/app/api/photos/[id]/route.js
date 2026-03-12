import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";
import { requireAuth } from "../../../../lib/auth.js";

export async function DELETE(request, { params }) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const { id } = await params;
        await prisma.photoItem.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
