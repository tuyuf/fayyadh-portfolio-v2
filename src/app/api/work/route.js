import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma.js";
import { requireAuth } from "../../../lib/auth.js";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeDeleted = searchParams.get("includeDeleted") === "true";
        const where = includeDeleted ? {} : { deletedAt: null };

        const workItems = await prisma.workItem.findMany({
            where,
            orderBy: { sortOrder: "asc" },
        });

        return NextResponse.json(workItems);
    } catch (error) {
        console.error("Error fetching work items:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(request) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        const item = await prisma.workItem.create({
            data: {
                year: body.year,
                company: body.company,
                position: body.position,
                sortOrder: body.sortOrder ?? 0,
            },
        });

        revalidatePath("/");
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error("Error creating work item:", error);
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}
