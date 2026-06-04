import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../lib/prisma.js";
import { requireAuth } from "../../../../lib/auth.js";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeDeleted = searchParams.get("includeDeleted") === "true";
        const where = includeDeleted ? {} : { deletedAt: null };

        const categories = await prisma.skillCategory.findMany({
            where,
            include: {
                skills: {
                    where: includeDeleted ? {} : { deletedAt: null },
                    orderBy: { sortOrder: "asc" },
                },
            },
            orderBy: { sortOrder: "asc" },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error fetching skill categories:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(request) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        const category = await prisma.skillCategory.create({
            data: {
                label: body.label,
                title: body.title,
                sortOrder: body.sortOrder ?? 0,
            },
        });

        revalidatePath("/");
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("Error creating skill category:", error);
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}
