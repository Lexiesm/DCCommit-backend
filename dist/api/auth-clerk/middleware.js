"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const backend_1 = require("@clerk/backend");
async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token proporcionado' });
        return;
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const verifiedToken = await (0, backend_1.verifyToken)(token, {
            issuer: 'https://concise-dinosaur-7.clerk.accounts.dev',
        });
        req.user = {
            ...verifiedToken,
            role: typeof verifiedToken.role === 'string' ? verifiedToken.role : undefined,
            email: typeof verifiedToken.email === 'string' ? verifiedToken.email : undefined,
            clerkId: verifiedToken.sub,
        };
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Token inválido', message: err.message });
    }
}
