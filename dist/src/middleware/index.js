"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const TOKEN_SECRET = (_a = process.env.TOKEN_SECRET) !== null && _a !== void 0 ? _a : '';
function notFoundHandler(req, res, next) {
    res.status(404);
    const error = new Error('Not found - ' + req.originalUrl);
    return next(error);
}
function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500);
    if (process.env.NODE_ENV === 'production') {
        res.json({
            message: err.message,
        });
    }
    else {
        res.json({
            message: err.message,
            stack: err.stack,
        });
    }
}
function checkTokenSetUser(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return next();
    jsonwebtoken_1.default.verify(token, TOKEN_SECRET, (error, payload) => {
        if (error)
            return next();
        req.user = payload;
        return next();
    });
}
function isLoggedIn(req, res, next) {
    if (!req.user) {
        res.status(401);
        return next(new Error('Unauthorized.'));
    }
    return next();
}
exports.default = {
    notFoundHandler,
    errorHandler,
    checkTokenSetUser,
    isLoggedIn,
};
//# sourceMappingURL=index.js.map