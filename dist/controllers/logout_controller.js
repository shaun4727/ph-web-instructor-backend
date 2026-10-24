"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = logout;
function logout(_req, res) {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
    res.status(200).json({
        message: 'Logout successful',
    });
}
