"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("../controllers/comment.controller");
const router = express_1.default.Router();
router.post('/', comment_controller_1.createComment);
router.get('/', comment_controller_1.getAllComments);
router.get('/:id', comment_controller_1.getCommentById);
router.delete('/:id', comment_controller_1.deleteComment);
exports.default = router;
