"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const prisma_1 = require("./lib/prisma");
const PORT = process.env.PORT || 4000;
async function startServer() {
    try {
        await prisma_1.prisma.$connect();
        console.log('Conexión a la base de datos establecida correctamente.');
        app_1.default.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        process.exit(1);
    }
}
startServer();
