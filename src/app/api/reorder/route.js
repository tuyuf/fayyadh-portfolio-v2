import { NextResponse } from "next/server";
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
            casestudyimages: prisma.caseStudyImage
        };

        const model = modelMap[type.toLowerCase()];
        if (!model) {
            return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
        }

        // Perform updates individually to avoid transaction timeouts in serverless environments
        for (const item of items) {
            await model.update({
                where: { id: item.id },
                data: { sortOrder: item.sortOrder }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error reordering items:", error);
        return NextResponse.json({ error: "Failed to reorder items" }, { status: 500 });
    }
}
