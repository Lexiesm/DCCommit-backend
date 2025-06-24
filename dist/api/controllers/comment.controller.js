"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.getCommentById = exports.getAllComments = exports.createComment = void 0;
const prisma_1 = require("../../lib/prisma");
const createComment = async (req, res) => {
    const { content, postId, userId } = req.body;
    if (!content || !postId || !userId) {
        res.status(400).json({ error: 'Faltan campos obligatorios' });
        return;
    }
    try {
        const comment = await prisma_1.prisma.comment.create({
            data: { content, postId, userId },
        });
        res.status(201).json(comment);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear comentario', details: error.message });
    }
};
exports.createComment = createComment;
const getAllComments = async (_, res) => {
    try {
        const comments = await prisma_1.prisma.comment.findMany();
        res.json(comments);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener comentarios' });
    }
};
exports.getAllComments = getAllComments;
const getCommentById = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await prisma_1.prisma.comment.findUnique({ where: { id: Number(id) } });
        if (!comment) {
            res.status(404).json({ error: 'Comentario no encontrado' });
            return;
        }
        res.json(comment);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al buscar comentario' });
    }
};
exports.getCommentById = getCommentById;
const deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma_1.prisma.comment.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar comentario' });
    }
};
exports.deleteComment = deleteComment;
