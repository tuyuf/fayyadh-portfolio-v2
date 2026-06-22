import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../lib/prisma.js";
import { requireAuth } from "../../../../lib/auth.js";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeDeleted = searchParams.get("includeDeleted") === "true";
        const where = includeDeleted ? {} : { deletedAt: null };

        const items = await prisma.skillItem.findMany({
            where,
            include: {
                category: true,
            },
            orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }],
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error("Error fetching skill items:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(request) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        const item = await prisma.skillItem.create({
            data: {
                categoryId: body.categoryId,
                name: body.name,
                level: body.level ?? 1,
                sortOrder: body.sortOrder ?? 0,
            },
            include: {
                category: true,
            },
        });

        revalidatePath("/");
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error("Error creating skill item:", error);
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}
