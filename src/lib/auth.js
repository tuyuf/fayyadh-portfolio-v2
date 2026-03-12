import { cookies } from "next/headers";

/**
 * Verify admin authentication for API write operations.
 * Returns true if the request has a valid admin_token cookie.
 */
export async function isAuthenticated() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token");
    return token?.value === "authenticated";
}

/**
 * Returns a 401 Response if not authenticated.
 * Use at the top of POST/PUT/DELETE handlers.
 */
export async function requireAuth() {
    const authed = await isAuthenticated();
    if (!authed) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
    return null; // means authenticated
}
