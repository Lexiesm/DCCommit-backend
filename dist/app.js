"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'https://www.dccommit.space'],
    credentials: true,
}));
app.options('*', (0, cors_1.default)());
app.use(express_1.default.json());
app.use(routes_1.default);
app.get('/', (req, res) => {
    res.send('Hello Divinos\n');
});
exports.default = app;
