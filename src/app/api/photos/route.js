import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma.js";
import { requireAuth } from "../../../lib/auth.js";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeDeleted = searchParams.get("includeDeleted") === "true";
        const where = includeDeleted ? {} : { deletedAt: null };

        const photos = await prisma.photoItem.findMany({
            where,
            orderBy: { sortOrder: "asc" },
        });
        return NextResponse.json(photos);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(request) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        // Support batch upload — body can be a single item or array
        const items = Array.isArray(body) ? body : [body];

        const created = await prisma.$transaction(
            items.map((item, idx) =>
                prisma.photoItem.create({
                    data: {
                        imageUrl: item.imageUrl,
                        cloudinaryId: item.cloudinaryId,
                        caption: item.caption || null,
                        sortOrder: item.sortOrder ?? idx,
                    },
                })
            )
        );

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("Error creating photo:", error);
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}
