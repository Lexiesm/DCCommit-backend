"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondToReport = exports.deleteReport = exports.getReportById = exports.getAllReports = exports.createReport = void 0;
const prisma_1 = require("../../lib/prisma");
const createReport = async (req, res) => {
    const { userId, targetId, targetType, reason } = req.body;
    if (!targetId || !targetType || !reason) {
        res.status(400).json({ error: 'Faltan campos obligatorios' });
        return;
    }
    try {
        const report = await prisma_1.prisma.report.create({
            data: {
                targetId,
                targetType,
                reason,
                date: new Date(),
                user: {
                    connect: { id: userId },
                },
            },
        });
        res.status(201).json(report);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear reporte' });
    }
};
exports.createReport = createReport;
const getAllReports = async (_, res) => {
    try {
        const reports = await prisma_1.prisma.report.findMany();
        res.json(reports);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener reportes' });
    }
};
exports.getAllReports = getAllReports;
const getReportById = async (req, res) => {
    const { id } = req.params;
    try {
        const report = await prisma_1.prisma.report.findUnique({ where: { id: Number(id) } });
        if (!report) {
            res.status(404).json({ error: 'Reporte no encontrado' });
            return;
        }
        res.json(report);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al buscar reporte' });
    }
};
exports.getReportById = getReportById;
const deleteReport = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma_1.prisma.report.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar reporte' });
    }
};
exports.deleteReport = deleteReport;
const respondToReport = async (req, res) => {
    const { id } = req.params;
    const { modderResponse } = req.body;
    if (!modderResponse) {
        res.status(400).json({ error: 'Respuesta del moderador requerida' });
        return;
    }
    try {
        const updated = await prisma_1.prisma.report.update({
            where: { id: Number(id) },
            data: { modderResponse },
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al responder reporte' });
    }
};
exports.respondToReport = respondToReport;
