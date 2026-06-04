import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma.js";
import { requireAuth } from "../../../lib/auth.js";

export async function POST(request) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const { type, items } = await request.json();

        if (!type || !items || !Array.isArray(items)) {
            return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
        }

        // Map types to prisma models
        const modelMap = {
            casestudies: prisma.caseStudyProject,
            photos: prisma.photoItem,
            videos: prisma.videoItem,
            webprojects: prisma.webProject,
            casestudyimages: prisma.caseStudyImage,
            education: prisma.educationItem,
            work: prisma.workItem,
            skillcategories: prisma.skillCategory,
            skillitems: prisma.skillItem,
            metrics: prisma.metric,
        };

        const model = modelMap[type.toLowerCase()];
        if (!model) {
            return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
        }

      // Batch updates in a transaction for atomicity and performance
        await prisma.$transaction(
            items.map((item) =>
                model.update({
                    where: { id: item.id },
                    data: { sortOrder: item.sortOrder },
                })
            )
        );

        revalidatePath("/");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error reordering items:", error);
        return NextResponse.json({ error: "Failed to reorder items" }, { status: 500 });
    }
}
