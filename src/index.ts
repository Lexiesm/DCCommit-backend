import app from './app'
import { prisma } from './lib/prisma' 

const PORT = process.env.PORT || 4000

async function startServer() {
  try {
    await prisma.$connect()
    console.log('Conexión a la base de datos establecida correctamente.')

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error)
    process.exit(1)
  }
}

startServer()

