import { prisma } from "./prisma.js";

/**
 * Server-side data fetching utilities.
 * These functions run on the server and query Prisma directly,
 * eliminating the need for client-side fetch() calls and API round-trips.
 */

export async function getCaseStudies() {
    try {
        return await prisma.caseStudyProject.findMany({
            where: { deletedAt: null },
            include: {
                images: { orderBy: { sortOrder: "asc" } },
            },
            orderBy: { sortOrder: "asc" },
        });
    } catch (error) {
        console.error("Error fetching case studies:", error);
        return [];
    }
}

export async function getPhotos() {
    try {
        return await prisma.photoItem.findMany({
            where: { deletedAt: null },
            orderBy: { sortOrder: "asc" },
        });
    } catch (error) {
        console.error("Error fetching photos:", error);
        return [];
    }
}

export async function getVideos() {
    try {
        return await prisma.videoItem.findMany({
            where: { deletedAt: null },
            orderBy: { sortOrder: "asc" },
        });
    } catch (error) {
        console.error("Error fetching videos:", error);
        return [];
    }
}

export async function getWebProjects() {
    try {
        return await prisma.webProject.findMany({
            where: { deletedAt: null },
            orderBy: { sortOrder: "asc" },
        });
    } catch (error) {
        console.error("Error fetching web projects:", error);
        return [];
    }
}

export async function getMarqueeImages() {
    try {
        const images = await prisma.caseStudyImage.findMany({
            where: {
                project: {
                    deletedAt: null,
                },
            },
            select: {
                imageUrl: true,
                width: true,
                height: true,
            },
            orderBy: { sortOrder: "asc" },
            take: 20,
        });
        return images;
    } catch (error) {
        console.error("Error fetching marquee images:", error);
        return [];
    }
}

export async function getAllHomepageData() {
    const [caseStudies, photos, videos, webProjects, marqueeImages] = await Promise.all([
        getCaseStudies(),
        getPhotos(),
        getVideos(),
        getWebProjects(),
        getMarqueeImages(),
    ]);

    return {
        caseStudies,
        photos,
        videos,
        webProjects,
        marqueeImages,
    };
}

export async function getStats() {
    const [caseStudiesCount, photosCount, videosCount, webProjectsCount] = await Promise.all([
        prisma.caseStudyProject.count({ where: { deletedAt: null } }),
        prisma.photoItem.count({ where: { deletedAt: null } }),
        prisma.videoItem.count({ where: { deletedAt: null } }),
        prisma.webProject.count({ where: { deletedAt: null } }),
    ]);

    return {
        caseStudies: caseStudiesCount,
        photos: photosCount,
        videos: videosCount,
        webProjects: webProjectsCount,
    };
}
