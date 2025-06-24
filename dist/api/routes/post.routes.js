"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("../controllers/post.controller");
const middleware_1 = require("../auth-clerk/middleware");
const router = express_1.default.Router();
router.post('/:clerkId', middleware_1.authMiddleware, post_controller_1.createPost);
router.get('/user/:id', middleware_1.authMiddleware, post_controller_1.getAllUserPosts);
router.get('/', post_controller_1.getAllPosts);
router.get('/:id', middleware_1.authMiddleware, post_controller_1.getPostById);
router.delete('/:id', middleware_1.authMiddleware, post_controller_1.deletePost);
router.patch('/:id', post_controller_1.updatePost);
router.patch('/:id/status', middleware_1.authMiddleware, post_controller_1.changePostStatus);
exports.default = router;
