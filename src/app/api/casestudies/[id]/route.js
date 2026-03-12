import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";
import { requireAuth } from "../../../../lib/auth.js";

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const project = await prisma.caseStudyProject.findUnique({
            where: { id },
            include: { images: { orderBy: { sortOrder: "asc" } } },
        });
        if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(project);
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

        // Delete existing images and recreate
        await prisma.caseStudyImage.deleteMany({ where: { projectId: id } });

        const project = await prisma.caseStudyProject.update({
            where: { id },
            data: {
                title: body.title,
                subtitle: body.subtitle || null,
                credits: body.credits || null,
                description: body.description,
                link: body.link || null,
                category: body.category,
                sortOrder: body.sortOrder ?? 0,
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

        return NextResponse.json(project);
    } catch (error) {
        console.error("Error updating case study:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const { id } = await params;
        await prisma.caseStudyProject.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
