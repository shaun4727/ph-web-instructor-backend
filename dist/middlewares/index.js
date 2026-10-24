"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../config/jwt");
const client_1 = require("../generated/prisma/client");
function authenticate(req, res, next) {
    // 1. Prefer the HttpOnly cookie; support Bearer tokens as fallback.
    const cookieToken = req.cookies?.accessToken;
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length).trim() : undefined;
    const token = typeof cookieToken === 'string' && cookieToken.length > 0 ? cookieToken : bearerToken;
    // 2. Reject requests without a token.
    if (!token) {
        res.status(401).json({
            message: 'Authentication token is required',
        });
        return;
    }
    try {
        // 3. Verify the token's signature and expiry.
        const decoded = jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.secret);
        // 4. Validate the required JWT payload fields.
        if (typeof decoded === 'string' ||
            typeof decoded.sub !== 'string' ||
            typeof decoded.email !== 'string' ||
            typeof decoded.role !== 'string' ||
            !Object.values(client_1.Role).includes(decoded.role)) {
            res.status(401).json({
                message: 'Invalid authentication token',
            });
            return;
        }
        const payload = decoded;
        // 5. Attach the authenticated user to the request.
        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
        // 6. Continue to the next middleware/controller.
        next();
    }
    catch {
        res.status(401).json({
            message: 'Invalid or expired authentication token',
        });
    }
}
