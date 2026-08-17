// app/api/admin/keys/route.js
import { validateToken } from "../utils/auth";

export async function GET(request) {
    try {
        // Validate admin token
        if (!(await validateToken(request))) {
            return Response.json({ error: "unauthorized" }, { status: 401 });
        }

        // In Next.js, we'll store overrides in a JSON file or use a simple approach
        // For now, return empty array (no overrides)
        return Response.json({ keys: [] });
    } catch (error) {
        return Response.json({ error: "server error" }, { status: 500 });
    }
}