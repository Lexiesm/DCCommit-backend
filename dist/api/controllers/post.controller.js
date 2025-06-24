"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePostStatus = exports.updatePost = exports.deletePost = exports.getAllUserPosts = exports.getPostById = exports.getAllPosts = exports.createPost = void 0;
const prisma_1 = require("../../lib/prisma");
// Crear un nuevo post
const createPost = async (req, res) => {
    const { title, content } = req.body;
    const clerkId = req.params.clerkId;
    const requester = req.user;
    if (!requester || requester.clerkId !== clerkId) {
        res.status(403).json({ error: 'No autorizado para crear posts con este clerkId.' });
        return;
    }
    if (!clerkId || !title || !content) {
        res.status(400).json({ error: 'Faltan campos obligatorios' });
        return;
    }
    const dbUser = await prisma_1.prisma.user.findUnique({
        where: { clerkId }
    });
    console.log('dbUser:', dbUser);
    if (!dbUser) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
    }
    try {
        const modderUser = await prisma_1.prisma.user.findFirst({
            where: { rol: "MODERATOR" }
        });
        if (!modderUser) {
            res.status(400).json({ error: "No hay un usuario moderador disponible" });
            return;
        }
        const post = await prisma_1.prisma.post.create({
            data: {
                title,
                content,
                date: new Date(),
                status: "pending",
                likes: 0,
                user: { connect: { id: dbUser.id } },
                modder: { connect: { id: modderUser.id } }
            }
        });
        res.status(201).json(post);
    }
    catch (err) {
        res.status(500).json({
            error: 'Error al crear post',
            details: err.message
        });
    }
};
exports.createPost = createPost;
// Obtener todos los posts
const getAllPosts = async (_, res) => {
    try {
        const posts = await prisma_1.prisma.post.findMany({
            include: {
                user: true,
            },
        });
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener posts' });
    }
};
exports.getAllPosts = getAllPosts;
// Obtener un post por ID
const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await prisma_1.prisma.post.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                user: true,
            }
        });
        if (!post) {
            res.status(404).json({ error: 'Post no encontrado' });
            return;
        }
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener post' });
    }
};
exports.getPostById = getPostById;
const getAllUserPosts = async (req, res) => {
    const clerkId = req.user?.sub;
    try {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { clerkId }
        });
        const posts = await prisma_1.prisma.post.findMany({
            where: { userId: existingUser?.id }
        });
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener posts' });
    }
};
exports.getAllUserPosts = getAllUserPosts;
// Eliminar un post
const deletePost = async (req, res) => {
    const { id } = req.params;
    const requester = req.user;
    const post = await prisma_1.prisma.post.findUnique({
        where: { id: Number(id) },
        include: { user: true }
    });
    if (!post) {
        res.status(404).json({ error: 'Post no encontrado' });
        return;
    }
    if (!requester) {
        res.status(401).json({ error: 'No autenticado' });
        return;
    }
    console.log('requester:', requester);
    if (!requester.role) {
        res.status(401).json({ error: 'No tiene rol' });
        return;
    }
    const isAuthor = post.user.clerkId === requester.clerkId;
    const isModOrAdmin = ['ADMIN', 'MODERATOR'].includes(requester.role);
    if (!isAuthor && !isModOrAdmin) {
        res.status(403).json({ error: 'No tienes permiso para eliminar este post' });
        return;
    }
    try {
        await prisma_1.prisma.post.delete({
            where: { id: Number(id) }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar post' });
    }
};
exports.deletePost = deletePost;
// Editar post
const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const requester = req.user;
    const post = await prisma_1.prisma.post.findUnique({ where: { id: Number(id) }, include: { user: true } });
    if (!post) {
        res.status(404).json({ error: 'Post no encontrado' });
        return;
    }
    if (!requester) {
        res.status(401).json({ error: 'No autenticado' });
        return;
    }
    if (!requester.role) {
        res.status(401).json({ error: 'No tiene rol' });
        return;
    }
    const isAuthor = post.user.clerkId === requester.clerkId;
    const isModOrAdmin = ['ADMIN', 'MODERATOR'].includes(requester.role);
    if (!isAuthor && !isModOrAdmin) {
        res.status(403).json({ error: 'No tienes permiso para editar este post' });
        return;
    }
    try {
        const post = await prisma_1.prisma.post.update({
            where: { id: Number(id) },
            data: {
                ...(title && { title }),
                ...(content && { content }),
            },
        });
        res.status(200).json({ message: 'Post actualizado exitosamente', post });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al actualizar post' });
    }
};
exports.updatePost = updatePost;
// (Opcional) Cambiar estado
const changePostStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const requester = req.user;
    if (!requester) {
        res.status(401).json({ error: 'No autenticado' });
        return;
    }
    if (!requester.role) {
        res.status(401).json({ error: 'No tiene rol' });
        return;
    }
    if (!['ADMIN', 'MODERATOR'].includes(requester.role)) {
        res.status(403).json({ error: 'Solo administradores o moderadores pueden cambiar el estado del post' });
        return;
    }
    if (!['approved', 'rejected', 'pending'].includes(status)) {
        res.status(400).json({ error: 'Estado inválido' });
        return;
    }
    try {
        const post = await prisma_1.prisma.post.update({
            where: { id: Number(id) },
            data: { status },
        });
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al cambiar estado del post' });
    }
};
exports.changePostStatus = changePostStatus;
