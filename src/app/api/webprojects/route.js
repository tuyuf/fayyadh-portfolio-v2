import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma.js";
import { requireAuth } from "../../../lib/auth.js";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeDeleted = searchParams.get("includeDeleted") === "true";
        const where = includeDeleted ? {} : { deletedAt: null };

        const projects = await prisma.webProject.findMany({
            where,
            orderBy: { sortOrder: "asc" },
        });
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(request) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        const project = await prisma.webProject.create({
            data: {
                title: body.title,
                description: body.description,
                techStack: body.techStack || [],
                projectUrl: body.projectUrl || null,
                embedUrl: body.embedUrl || null,
                thumbnailUrl: body.thumbnailUrl || null,
                cloudinaryId: body.cloudinaryId || null,
                sortOrder: body.sortOrder ?? 0,
            },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error("Error creating web project:", error);
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}
