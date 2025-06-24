"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const report_controller_1 = require("../controllers/report.controller");
const middleware_1 = require("../auth-clerk/middleware");
const router = express_1.default.Router();
router.post('/', report_controller_1.createReport);
router.get('/', middleware_1.authMiddleware, report_controller_1.getAllReports);
router.get('/:id', report_controller_1.getReportById);
router.delete('/:id', report_controller_1.deleteReport);
router.patch('/:id/respond', report_controller_1.respondToReport);
exports.default = router;
