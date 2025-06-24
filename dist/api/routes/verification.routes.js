"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verification_controller_1 = require("../controllers/verification.controller");
const router = express_1.default.Router();
router.post('/', verification_controller_1.createVerification);
router.get('/', verification_controller_1.getAllVerifications);
router.get('/:id', verification_controller_1.getVerificationById);
router.patch('/:id', verification_controller_1.updateVerification);
router.delete('/:id', verification_controller_1.deleteVerification);
exports.default = router;
