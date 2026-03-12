import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma.js";
import { requireAuth } from "../../../lib/auth.js";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeDeleted = searchParams.get("includeDeleted") === "true";
        const where = includeDeleted ? {} : { deletedAt: null };

        const videos = await prisma.videoItem.findMany({
            where,
            orderBy: { sortOrder: "asc" },
        });
        return NextResponse.json(videos);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(request) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        const video = await prisma.videoItem.create({
            data: {
                title: body.title,
                url: body.url,
                description: body.description || null,
                thumbnail: body.thumbnail || null,
                sortOrder: body.sortOrder ?? 0,
            },
        });

        return NextResponse.json(video, { status: 201 });
    } catch (error) {
        console.error("Error creating video:", error);
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}
