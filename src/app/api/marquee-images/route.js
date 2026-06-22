import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma.js";

/**
 * GET /api/marquee-images
 * Returns a flat array of image URLs from all non-deleted case studies.
 * Optimized for the marquee: only imageUrl, no nested project data.
 */
export async function GET() {
    try {
        const images = await prisma.caseStudyImage.findMany({
            where: {
                project: { deletedAt: null },
            },
            select: {
                imageUrl: true,
                width: true,
                height: true,
            },
            orderBy: {
                sortOrder: "asc",
            },
        });

        // Filter out images with missing dimensions, then return with aspect ratio
        const urls = images
            .filter((img) => img.width && img.height && img.width > 0 && img.height > 0)
            .map((img) =>
                ({
                    url: img.imageUrl,
                    width: img.width,
                    height: img.height,
                    aspectRatio: img.height / img.width,
                }));

        return NextResponse.json(urls);
    } catch (error) {
        console.error("Error fetching marquee images:", error);
        return NextResponse.json([], { status: 500 });
    }
}
