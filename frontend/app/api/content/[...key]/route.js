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
    const { key } = await params;
    const keyStr = Array.isArray(key) ? key.join("/") : key;

    // Map keys to static paths
    const keyToPath = {
        topics: "/data/topics.json",
        courses: "/data/courses.json",
        esg: "/data/esg.json",
        casestudies: "/data/caseStudies.json",
        statistics: "/data/statistics.json",
    };

    let staticPath = keyToPath[keyStr];

    // Handle course:slug pattern
    if (keyStr.startsWith("course:")) {
        const slug = keyStr.replace("course:", "");
        staticPath = `/data/courses/${slug}.json`;
    }

    if (!staticPath) {
        return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    }

    try {
        // Use turbopackIgnore comment to prevent tracing
        const filePath = path.join(/*turbopackIgnore: true*/ process.cwd(), "public", staticPath);

        try {
            const content = await fs.readFile(filePath, "utf-8");
            return new NextResponse(content, {
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store, max-age=0",
                },
            });
        } catch (fileError) {
            // Try fallback path without /public
            const fallbackPath = path.join(/*turbopackIgnore: true*/ process.cwd(), staticPath);
            try {
                const content = await fs.readFile(fallbackPath, "utf-8");
                return new NextResponse(content, {
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-store, max-age=0",
                    },
                });
            } catch (fallbackError) {
                return NextResponse.json({ error: "File not found" }, { status: 404 });
            }
        }
    } catch (error) {
        console.error("Error reading file:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}