"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserByClerkId = exports.getAllUsers = exports.updateNickname = exports.syncUserFromClerk = void 0;
const prisma_1 = require("../../lib/prisma");
const library_1 = require("@prisma/client/runtime/library");
const bcrypt_1 = __importDefault(require("bcrypt"));
const syncUserFromClerk = async (req, res) => {
    const { name, nickname, email, profile_picture, rol } = req.body;
    const clerkId = req.user?.sub;
    if (!clerkId || !email) {
        res.status(400).json({ error: 'Faltan campos obligatorios: clerkId o email' });
        return;
    }
    try {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { clerkId }
        });
        let user;
        if (!existingUser) {
            user = await prisma_1.prisma.user.create({
                data: {
                    clerkId,
                    name,
                    nickname,
                    password: 'from-clerk',
                    email,
                    profile_picture,
                    rol,
                }
            });
        }
        else {
            user = await prisma_1.prisma.user.update({
                where: { clerkId },
                data: {
                    clerkId,
                    name,
                    email,
                    profile_picture,
                    rol
                }
            });
        }
        res.json({ success: true, user });
    }
    catch (err) {
        console.error('Error al sincronizar usuario:', err);
        if (err instanceof library_1.PrismaClientKnownRequestError &&
            err.code === 'P2002' &&
            Array.isArray(err.meta?.target) && err.meta.target.includes('nickname')) {
            res.status(409).json({ error: 'Ese nickname ya está en uso' });
        }
        res.status(500).json({
            error: 'Error al sincronizar usuario',
            details: err.message
        });
    }
};
exports.syncUserFromClerk = syncUserFromClerk;
// Update usuario desde clerk
const updateNickname = async (req, res) => {
    const { clerkId, nickname } = req.body;
    if (!clerkId || !nickname) {
        res.status(400).json({ error: 'Faltan campos obligatorios' });
        return;
    }
    try {
        const updatedUser = await prisma_1.prisma.user.update({
            where: { clerkId },
            data: { nickname }
        });
        res.json({ success: true, user: updatedUser });
    }
    catch (err) {
        console.error('Error al actualizar nickname:', err);
        if (err.code === 'P2002' &&
            Array.isArray(err.meta?.target) &&
            err.meta.target.includes('nickname')) {
            res.status(409).json({ error: 'Ese nickname ya está en uso' });
        }
        res.status(500).json({ error: 'Error al actualizar nickname' });
    }
};
exports.updateNickname = updateNickname;
const getAllUsers = async (_req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany();
        if (users.length === 0) {
            res.status(404).json({ error: 'No se encontraron usuarios' });
            return;
        }
        res.status(200).json(users);
    }
    catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).json({ error: 'Error al obtener usuarios', details: err.message });
    }
};
exports.getAllUsers = getAllUsers;
const getUserByClerkId = async (req, res) => {
    const { clerkId } = req.params;
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { clerkId }, // string
        });
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};
exports.getUserByClerkId = getUserByClerkId;
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, nickname, email, profile_picture, password } = req.body;
    try {
        const data = {};
        if (name !== undefined)
            data.name = name;
        if (nickname !== undefined)
            data.nickname = nickname;
        if (email !== undefined)
            data.email = email;
        if (profile_picture !== undefined)
            data.profile_picture = profile_picture;
        if (password !== undefined) {
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            data.password = hashedPassword;
        }
        const user = await prisma_1.prisma.user.update({
            where: { id: parseInt(id) },
            data,
        });
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        res.status(200).json({
            id: user.id,
            name: user.name,
            nickname: user.nickname,
            email: user.email,
            profile_picture: user.profile_picture,
            rol: user.rol,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Error al actualizar usuario', details: err.message });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma_1.prisma.user.delete({
            where: { id: parseInt(id) },
        });
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        res.status(204).json({ message: 'Usuario eliminado', user });
    }
    catch (err) {
        res.status(500).json({ error: 'Error al eliminar usuario', details: err.message });
    }
};
exports.deleteUser = deleteUser;
