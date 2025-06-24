"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVerification = exports.updateVerification = exports.getVerificationById = exports.getAllVerifications = exports.createVerification = void 0;
const prisma_1 = require("../../lib/prisma");
const createVerification = async (req, res) => {
    try {
        const { postId, modderId, statusVerification, reasonAnswer } = req.body;
        const verification = await prisma_1.prisma.verification.create({
            data: {
                post: { connect: { id: postId } },
                modder: { connect: { id: modderId } },
                date: new Date(),
                statusVerification,
                reasonAnswer,
            },
            include: {
                post: true,
                modder: true,
            },
        });
        res.status(201).json(verification);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating verification' });
    }
};
exports.createVerification = createVerification;
const getAllVerifications = async (_req, res) => {
    try {
        const verifications = await prisma_1.prisma.verification.findMany({
            include: {
                post: true,
                modder: true,
            },
        });
        res.json(verifications);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching verifications' });
    }
};
exports.getAllVerifications = getAllVerifications;
const getVerificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const verification = await prisma_1.prisma.verification.findUnique({
            where: { id: Number(id) },
            include: {
                post: true,
                modder: true,
            },
        });
        if (!verification) {
            res.status(404).json({ message: 'Verification not found' });
            return;
        }
        res.json(verification);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching verification' });
    }
};
exports.getVerificationById = getVerificationById;
const updateVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const { statusVerification, reasonAnswer } = req.body;
        const updated = await prisma_1.prisma.verification.update({
            where: { id: Number(id) },
            data: {
                statusVerification,
                reasonAnswer,
            },
        });
        res.json(updated);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating verification' });
    }
};
exports.updateVerification = updateVerification;
const deleteVerification = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.verification.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting verification' });
    }
};
exports.deleteVerification = deleteVerification;
