import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";
import { requireAuth } from "../../../../lib/auth.js";

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const video = await prisma.videoItem.findUnique({ where: { id } });
        if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(video);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const { id } = await params;
        const body = await request.json();

        const video = await prisma.videoItem.update({
            where: { id },
            data: {
                title: body.title,
                url: body.url,
                description: body.description || null,
                thumbnail: body.thumbnail || null,
                sortOrder: body.sortOrder ?? 0,
            },
        });

        return NextResponse.json(video);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const { id } = await params;
        await prisma.videoItem.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
