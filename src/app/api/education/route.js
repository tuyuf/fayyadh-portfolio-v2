import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma.js";
import { requireAuth } from "../../../lib/auth.js";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeDeleted = searchParams.get("includeDeleted") === "true";
        const where = includeDeleted ? {} : { deletedAt: null };

        const education = await prisma.educationItem.findMany({
            where,
            orderBy: { sortOrder: "asc" },
        });

        return NextResponse.json(education);
    } catch (error) {
        console.error("Error fetching education:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(request) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        const item = await prisma.educationItem.create({
            data: {
                year: body.year,
                institution: body.institution,
                degree: body.degree || null,
                sortOrder: body.sortOrder ?? 0,
            },
        });

        revalidatePath("/");
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error("Error creating education item:", error);
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}
