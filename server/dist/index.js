"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const middleware_1 = __importDefault(require("./middleware"));
const books_1 = __importDefault(require("./routes/books"));
const movies_1 = __importDefault(require("./routes/movies"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = express_1.default();
app.use(helmet_1.default());
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(middleware_1.default.checkTokenSetUser);
app.use(middleware_1.default.rateLimitRequest);
app.use(middleware_1.default.slowDownRequest);
app.use('/getMovie', middleware_1.default.isLoggedIn, movies_1.default);
app.use('/getBook', middleware_1.default.isLoggedIn, books_1.default);
app.use('/auth', auth_1.default);
app.use(middleware_1.default.notFoundHandler);
app.use(middleware_1.default.errorHandler);
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server started on port ${port}.`);
});
//# sourceMappingURL=index.js.map