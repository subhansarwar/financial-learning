// app/api/admin/utils/auth.js
import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function hmacHex(secret, msg) {
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(msg);
    return hmac.digest("hex");
}

export async function validateToken(request) {
    if (!ADMIN_PASSWORD) return false;

    const auth = request.headers.get("authorization") || "";
    const token = auth.replace(/^Bearer\s+/i, "");
    const [exp, sig] = token.split(".");

    if (!exp || !sig || +exp < Date.now()) return false;

    const expected = await hmacHex(ADMIN_PASSWORD, exp);
    return sig === expected;
}