import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma.js";
import { requireAuth } from "../../../lib/auth.js";

export async function GET() {
    try {
        const profile = await prisma.profile.findFirst({
            orderBy: { createdAt: "asc" },
        });
        return NextResponse.json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(request) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        const existing = await prisma.profile.findFirst({
            orderBy: { createdAt: "asc" },
        });

        const data = {
            name: body.name,
            role: body.role,
            email: body.email || null,
            phone: body.phone || null,
            birthDate: body.birthDate || null,
            aboutText: body.aboutText,
            motto: body.motto || null,
            photoUrl: body.photoUrl || null,
            photoCloudinaryId: body.photoCloudinaryId || null,
        };

        const profile = existing
            ? await prisma.profile.update({
                  where: { id: existing.id },
                  data,
              })
            : await prisma.profile.create({ data });

        revalidatePath("/");
        return NextResponse.json(profile, { status: existing ? 200 : 201 });
    } catch (error) {
        console.error("Error upserting profile:", error);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}
