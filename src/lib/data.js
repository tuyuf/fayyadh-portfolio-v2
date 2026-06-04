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

export async function getProfile() {
    try {
        return await prisma.profile.findFirst();
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

export async function getEducation() {
    try {
        return await prisma.educationItem.findMany({
            where: { deletedAt: null },
            orderBy: { sortOrder: "asc" },
        });
    } catch (error) {
        console.error("Error fetching education:", error);
        return [];
    }
}

export async function getWorkExperience() {
    try {
        return await prisma.workItem.findMany({
            where: { deletedAt: null },
            orderBy: { sortOrder: "asc" },
        });
    } catch (error) {
        console.error("Error fetching work experience:", error);
        return [];
    }
}

export async function getSkillCategories() {
    try {
        return await prisma.skillCategory.findMany({
            where: { deletedAt: null },
            include: {
                skills: {
                    where: { deletedAt: null },
                    orderBy: { sortOrder: "asc" },
                },
            },
            orderBy: { sortOrder: "asc" },
        });
    } catch (error) {
        console.error("Error fetching skill categories:", error);
        return [];
    }
}

export async function getMetrics() {
    try {
        return await prisma.metric.findMany({
            where: { deletedAt: null },
            orderBy: { sortOrder: "asc" },
        });
    } catch (error) {
        console.error("Error fetching metrics:", error);
        return [];
    }
}

export async function getAllHomepageData() {
    const [caseStudies, photos, videos, webProjects, marqueeImages, profile, education, workExperience, skillCategories, metrics] = await Promise.all([
        getCaseStudies(),
        getPhotos(),
        getVideos(),
        getWebProjects(),
        getMarqueeImages(),
        getProfile(),
        getEducation(),
        getWorkExperience(),
        getSkillCategories(),
        getMetrics(),
    ]);

    return {
        caseStudies,
        photos,
        videos,
        webProjects,
        marqueeImages,
        profile,
        education,
        workExperience,
        skillCategories,
        metrics,
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
