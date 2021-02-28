"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nedb_1 = __importDefault(require("nedb"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const TOKEN_SECRET = (_a = process.env.TOKEN_SECRET) !== null && _a !== void 0 ? _a : '';
const router = express_1.Router();
const db = new nedb_1.default({ filename: './src/db/users.db', autoload: true });
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        db.findOne({ username }, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Invalid credentials.');
            if (err)
                throw error;
            const passwordsMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!passwordsMatch)
                throw error;
            const payload = {
                id: user._id,
                username: username,
            };
            const token = jsonwebtoken_1.default.sign(payload, TOKEN_SECRET, { expiresIn: '1d' });
            return res.json({ message: 'Login successful.', token, payload });
        }));
    }
    catch (error) {
        res.status(422);
        return next(error);
    }
}));
router.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    db.findOne({ username }, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err)
                throw err;
            if (user)
                throw new Error('Username is already in use.');
            const hash = yield bcryptjs_1.default.hash(password, 12);
            db.insert({ username, password: hash });
            return res.json({ message: 'Registration successful.' });
        }
        catch (error) {
            res.status(422);
            return next(error);
        }
    }));
}));
exports.default = router;
//# sourceMappingURL=auth.js.map