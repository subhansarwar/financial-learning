// app/api/content/[...key]/route.js
import { promises as fs } from "fs";
import path from "path";

const STATIC_PATHS = {
    topics: "data/topics.json",
    courses: "data/courses.json",
    esg: "data/esg-data.json",
};

function getStaticPath(key) {
    if (STATIC_PATHS[key]) return STATIC_PATHS[key];
    if (key.startsWith("course:")) {
        const slug = key.slice(7).replace(/[^a-z0-9-]/gi, "").toLowerCase();
        return `data/courses/${slug}.json`;
    }
    return null;
}

export async function GET(request, { params }) {
    try {
        const key = decodeURIComponent(params.key.join("/"));
        const staticPath = getStaticPath(key);

        if (!staticPath) {
            return Response.json({ error: "unknown key" }, { status: 404 });
        }

        try {
            // Add turbopackIgnore comment to fix build warning
            const filePath = path.join(
                /*turbopackIgnore: true*/
                process.cwd(),
                staticPath
            );
            const content = await fs.readFile(filePath, "utf-8");
            return new Response(content, {
                headers: {
                    "content-type": "application/json",
                    "cache-control": "no-store",
                },
            });
        } catch (err) {
            return Response.json({ error: "file not found" }, { status: 404 });
        }
    } catch (error) {
        return Response.json({ error: "server error" }, { status: 500 });
    }
}