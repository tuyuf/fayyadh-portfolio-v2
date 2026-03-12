import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma.js";
import { requireAuth } from "../../../lib/auth.js";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeDeleted = searchParams.get("includeDeleted") === "true";
        const where = includeDeleted ? {} : { deletedAt: null };

        const projects = await prisma.caseStudyProject.findMany({
            where,
            include: {
                images: { orderBy: { sortOrder: "asc" } },
            },
            orderBy: { sortOrder: "asc" },
        });
        return NextResponse.json(projects);
    } catch (error) {
        console.error("Error fetching case studies:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(request) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        const project = await prisma.caseStudyProject.create({
            data: {
                title: body.title,
                subtitle: body.subtitle || null,
                credits: body.credits || null,
                description: body.description,
                link: body.link || null,
                category: body.category, // "uiux" | "brand"
                sortOrder: body.sortOrder || 0,
                images: {
                    create: (body.images || []).map((img, idx) => ({
                        imageUrl: img.imageUrl,
                        cloudinaryId: img.cloudinaryId,
                        caption: img.caption || null,
                        altText: img.altText || null,
                        sortOrder: idx,
                    })),
                },
            },
            include: { images: true },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error("Error creating case study:", error);
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}
