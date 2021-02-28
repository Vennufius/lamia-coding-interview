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
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = require("express");
const router = express_1.Router();
const openLibraryAPIUrl = 'https://openlibrary.org/api/books?';
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { isbn } = req.query;
    try {
        if (!isbn)
            throw new Error('ISBN needed.');
        const queryObject = {
            format: 'json',
            jscmd: 'data',
            bibkeys: `ISBN:${isbn}`,
        };
        const queryString = new URLSearchParams(queryObject);
        const response = yield axios_1.default.get(`${openLibraryAPIUrl}${queryString}`);
        return res.json(response.data);
    }
    catch (error) {
        if (error.response) {
            res.status(error.response.status);
            return next(error.response.data);
        }
        res.status(422);
        return next(error);
    }
}));
exports.default = router;
//# sourceMappingURL=books.js.map