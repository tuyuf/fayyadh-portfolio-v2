import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma.js";
import { requireAuth } from "../../../lib/auth.js";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeDeleted = searchParams.get("includeDeleted") === "true";
        const where = includeDeleted ? {} : { deletedAt: null };

        const metrics = await prisma.metric.findMany({
            where,
            orderBy: { sortOrder: "asc" },
        });

        return NextResponse.json(metrics);
    } catch (error) {
        console.error("Error fetching metrics:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(request) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        const metric = await prisma.metric.create({
            data: {
                label: body.label,
                value: body.value,
                suffix: body.suffix || null,
                description: body.description || null,
                sortOrder: body.sortOrder ?? 0,
            },
        });

        revalidatePath("/");
        return NextResponse.json(metric, { status: 201 });
    } catch (error) {
        console.error("Error creating metric:", error);
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}
