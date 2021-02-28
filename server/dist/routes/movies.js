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
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const router = express_1.Router();
dotenv_1.default.config();
const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDbAPIUrl = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&type=movie&`;
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, year, plot } = req.query;
    try {
        const queryObject = {
            t: title,
            y: year,
            plot: plot,
        };
        const filteredQueryObject = Object.entries(queryObject).filter(([key, value]) => value);
        const queryString = new URLSearchParams(filteredQueryObject);
        const response = yield axios_1.default.get(`${OMDbAPIUrl}${queryString}`);
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
//# sourceMappingURL=movies.js.map