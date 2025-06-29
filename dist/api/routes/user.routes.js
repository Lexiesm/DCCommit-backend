"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const middleware_1 = require("../auth-clerk/middleware");
const router = (0, express_1.Router)();
router.post('/sync-user', middleware_1.authMiddleware, user_controller_1.syncUserFromClerk);
router.get('/', middleware_1.authMiddleware, user_controller_1.getAllUsers);
router.get('/by-clerk/:clerkId', user_controller_1.getUserByClerkId);
router.patch('/update-nickname', user_controller_1.updateNickname);
router.patch('/:id', user_controller_1.updateUser);
router.delete('/:id', user_controller_1.deleteUser);
exports.default = router;
