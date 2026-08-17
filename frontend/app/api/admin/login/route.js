// app/api/admin/login/route.js
import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function hmacHex(secret, msg) {
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(msg);
    return hmac.digest("hex");
}

export async function POST(request) {
    try {
        const body = await request.json();
        const password = body.password || "";

        if (!ADMIN_PASSWORD) {
            return Response.json({ error: "admin not configured" }, { status: 503 });
        }

        if (password !== ADMIN_PASSWORD) {
            return Response.json({ ok: false }, { status: 401 });
        }

        const exp = String(Date.now() + 12 * 3600 * 1000);
        const sig = await hmacHex(ADMIN_PASSWORD, exp);

        return Response.json({ ok: true, token: `${exp}.${sig}` });
    } catch (error) {
        return Response.json({ error: "server error" }, { status: 500 });
    }
}