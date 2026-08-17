// app/api/admin/delete/route.js
import { promises as fs } from "fs";
import path from "path";
import { validateToken } from "../utils/auth";

const overrides = {};

function getStaticPath(key) {
    const STATIC_PATHS = {
        topics: "data/topics.json",
        courses: "data/courses.json",
        esg: "data/esg-data.json",
    };
    if (STATIC_PATHS[key]) return STATIC_PATHS[key];
    if (key.startsWith("course:")) {
        const slug = key.slice(7).replace(/[^a-z0-9-]/gi, "").toLowerCase();
        return `data/courses/${slug}.json`;
    }
    return null;
}

export async function POST(request) {
    try {
        // Validate admin token
        if (!(await validateToken(request))) {
            return Response.json({ error: "unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { key } = body;

        if (!key || !getStaticPath(key)) {
            return Response.json({ error: "bad key" }, { status: 400 });
        }

        // Delete from memory
        delete overrides[key];

        // Delete from file system
        try {
            const filePath = path.join(process.cwd(), "data", "overrides", `${key}.json`);
            await fs.unlink(filePath).catch(() => { });
        } catch (err) {
            console.error("Failed to delete file:", err);
        }

        return Response.json({ ok: true });
    } catch (error) {
        return Response.json({ error: "server error" }, { status: 500 });
    }
}