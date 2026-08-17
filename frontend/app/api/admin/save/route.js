// app/api/admin/save/route.js
import { promises as fs } from "fs";
import path from "path";
import { validateToken } from "../utils/auth";

// In-memory store for development (or use file system)
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
    const { key, data } = body;

    if (!key || typeof key !== "string" || !getStaticPath(key) || data == null) {
      return Response.json({ error: "bad key or data" }, { status: 400 });
    }

    // Store override in memory (for development)
    // In production, you'd use a database or file system
    overrides[key] = data;

    // Optionally save to file system
    try {
      const filePath = path.join(process.cwd(), "data", "overrides", `${key}.json`);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Failed to save to file:", err);
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: "server error" }, { status: 500 });
  }
}