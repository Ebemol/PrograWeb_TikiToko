import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http"; 
import { Server } from "socket.io"; 
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient, Prisma } from "@prisma/client";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5002;
const prisma = new PrismaClient();

// --- TIPOS (Para evitar errores de TypeScript) ---
type MessageWithUser = Prisma.MessageGetPayload<{
    include: {
        user: { 
            select: { username: true, nivel: true, avatar: true }
        }
    }
}>;

// ==========================================
// 1. CONFIGURACIÓN
// ==========================================

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

io.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
});

// ==========================================
// 2. STREAMS & REGALOS
// ==========================================

// --- INICIAR STREAM ---
app.post("/stream/start", async (req: Request, res: Response) => {
  const { userId, titulo, claveStream, gifts } = req.body;

  if (!userId || !titulo || !claveStream) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    // 1. Apagar streams anteriores por seguridad
    await prisma.stream.updateMany({
        where: { userId: Number(userId), isLive: true },
        data: { isLive: false }
    });

    // 2. Crear Stream (Inicializamos duración en 0)
    const nuevoStream = await prisma.stream.create({
      data: {
        titulo: titulo,
        isLive: true,
        userId: Number(userId),
        clave: claveStream,
        durationSeconds: 0, 
        // Guardar regalos configurados
        gifts: {
          create: gifts && Array.isArray(gifts) ? gifts.map((g: any) => ({
            nombre: g.nombre,
            costo: Number(g.cost), 
            emoji: g.emoji,
            image: g.image || null
          })) : []
        }
      }
    });

    res.json({ message: "Stream iniciado", streamId: nuevoStream.id });

  } catch (error) {
    console.error("Error al iniciar stream:", error);
    res.status(500).json({ error: "Error al iniciar stream" });
  }
});

// --- FINALIZAR STREAM (CÁLCULO DE TIEMPO) ---
app.post("/stream/end", async (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "Falta userId" });
  
    try {
        // 1. Buscar stream activo para saber cuándo empezó
        const activeStream = await prisma.stream.findFirst({
            where: { userId: Number(userId), isLive: true },
        });

        if (!activeStream) {
            // Limpieza de seguridad si no se encuentra
            await prisma.stream.updateMany({
                where: { userId: Number(userId), isLive: true },
                data: { isLive: false }
            });
            return res.status(404).json({ message: "No se encontró un stream activo." });
        }

        // 2. Calcular duración real
        const now = new Date();
        const startTime = activeStream.createdAt;
        const durationSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);

        // 3. Guardar duración y apagar
        await prisma.stream.update({
          where: { id: activeStream.id },
          data: { 
                isLive: false,
                durationSeconds: durationSeconds 
            }
        });

        console.log(`Stream finalizado. Duración: ${durationSeconds} segundos.`);
        res.json({ message: "Stream finalizado", duration: durationSeconds });
    } catch (error) {
      console.error("Error al finalizar:", error);
      res.status(500).json({ error: "Error al finalizar" });
    }
});

// --- OBTENER DATOS POR CLAVE (VIEWER) ---
app.get("/stream/key/:clave", async (req, res) => {
    const { clave } = req.params;
    try {
        const stream = await prisma.stream.findFirst({
            where: { clave: clave, isLive: true },
            include: {
                streamer: { select: { id: true, username: true, avatar: true } },
                gifts: true 
            }
        });

        if (!stream) return res.status(404).json({ error: "No encontrado" });
        res.json(stream);
    } catch (error) {
        res.status(500).json({ error: "Error servidor" });
    }
});

// --- LISTAR EN VIVO ---
app.get("/streams/live", async (req, res) => {
  try {
    const streams = await prisma.stream.findMany({
      where: { isLive: true },
      include: {
        streamer: { select: { username: true, avatar: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(streams);
  } catch (error) {
    res.status(500).json({ error: "Error cargando streams" });
  }
});

// ==========================================
// 3. HERRAMIENTAS Y ESTADÍSTICAS (NUEVO)
// ==========================================

app.get("/tools/stats/:userId", async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "ID inválido" });

    try {
        // Total de segundos transmitidos
        const aggregation = await prisma.stream.aggregate({
            _sum: { durationSeconds: true },
            where: { userId: userId, isLive: false }
        });

        const totalSeconds = aggregation._sum.durationSeconds || 0;

        // Historial para gráfico
        const history = await prisma.stream.findMany({
            where: { userId: userId, durationSeconds: { gt: 0 } },
            select: { createdAt: true },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            totalDurationSeconds: totalSeconds,
            streamHistory: history
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo estadísticas" });
    }
});

// ==========================================
// 4. CHAT, REGALOS Y GAMIFICACIÓN (¡INTACTO!)
// ==========================================

// --- ENVIAR REGALO ---
app.post("/gift/send", async (req: Request, res: Response) => {
  const { userId, giftId, streamId, message } = req.body;
  if (!userId || !giftId || !streamId) return res.status(400).json({ error: "Datos faltantes" });

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const gift = await prisma.gift.findUnique({ where: { id: Number(giftId) } });
    if (!gift) return res.status(404).json({ error: "Regalo no existe" });

    if (user.coins < gift.costo) return res.status(400).json({ error: "Saldo insuficiente" });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { coins: { decrement: gift.costo } },
      select: { coins: true }
    });

    // Notificar al overlay
    io.emit("new_gift_event", {
      senderName: user.username,
      avatar: user.avatar,
      message,
      giftName: gift.nombre,
      giftEmoji: gift.emoji,
      giftImage: gift.image,
      timestamp: new Date()
    });

    res.json({ success: true, newBalance: updatedUser.coins });
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

// --- OBTENER MENSAJES ---
app.get("/messages", async (req, res) => {
  try {
    const mensajes = await prisma.message.findMany({
      where: { streamId: 1 }, 
      take: 100,
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { username: true, nivel: true, avatar: true } } }
    }) as MessageWithUser[];

    const historial = mensajes.map((msg) => ({
      usuario: msg.user.username,
      texto: msg.texto,
      nivel: msg.user.nivel
    }));

    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: "Error cargando mensajes" });
  }
});

// --- ENVIAR MENSAJE Y SUBIR NIVEL (¡IMPORTANTE!) ---
app.post("/mensaje/:userId", async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const { texto } = req.body;
  if (isNaN(userId) || !texto) return res.status(400).json({ error: "Datos inválidos" });

  try {
    // Asegurar chat global
    await prisma.stream.upsert({
      where: { id: 1 },
      update: {}, 
      create: { id: 1, titulo: "Chat Global", isLive: true, userId: userId }
    });

    // Guardar mensaje
    await prisma.message.create({ data: { texto, userId, streamId: 1 } });

    // Lógica de Gamificación
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    let nuevoXP = (user.xp || 0) + 1;
    let nivelActual = user.nivel || 1;
    const xpNecesaria = nivelActual * 10;
    let subioNivel = false;

    if (nuevoXP >= xpNecesaria) {
      nivelActual++;
      nuevoXP = 0;
      subioNivel = true;
    }

    // Actualizar usuario en DB
    await prisma.user.update({
      where: { id: userId },
      data: { xp: nuevoXP, nivel: nivelActual }
    });

    // Emitir evento Socket (Esto actualiza el chat en vivo)
    io.emit("chat_message", {
        usuario: user.username,
        texto: texto,
        nivel: nivelActual, // Envia el nuevo nivel
        avatar: user.avatar
    });

    // Responder al cliente con datos actualizados
    res.json({ 
        status: "success", 
        nivel: nivelActual, 
        xp: nuevoXP, 
        nextLevelXp: xpNecesaria,
        subio_nivel: subioNivel 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno" });
  }
});

// ==========================================
// 5. USUARIOS Y PERFIL
// ==========================================

app.post("/login", async (req: Request, resp: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({ where: { email, password } });
    if (!user) return resp.status(401).json({ error: "Credenciales inválidas" });
    const { password: _, ...userSafe } = user;
    return resp.status(200).json({ user: userSafe, token: "ine-token" });
  } catch (error) { return resp.status(500).json({ error: "Error interno" }); }
});

app.post("/create", async (req: Request, resp: Response) => {
  const { name, email, password, username, genere, dayborn } = req.body;
  try {
    const existe = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existe) return resp.status(400).json({ error: "Ocupado" });
    const nuevoUsuario = await prisma.user.create({
      data: { name, email, password, username, genere, dayborn, coins: 100, xp: 0, nivel: 1 }
    });
    return resp.status(201).json({ message: "Creado", user: nuevoUsuario });
  } catch (error) { return resp.status(500).json({ error: "Error al crear" }); }
});

app.get("/user/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id); 
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "No encontrado" });
    const { password, ...resto } = user;
    res.json({ user: resto });
  } catch (e) { res.status(500).json({ error: "Error servidor" }); }
});

app.put("/update-profile", async (req: Request, res: Response) => {
  const { userId, username, email, bio, avatar, theme, notifications, privacy } = req.body;
  const id = Number(userId);
  try {
    const settingsData = { notifications, privacy };
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { username, email, bio, avatar, theme, settings: settingsData }
    });
    const { password, ...userSafe } = updatedUser;
    res.json({ message: "Guardado", user: userSafe });
  } catch (error) { res.status(500).json({ error: "Error guardando" }); }
});

app.post("/buy-coins", async (req: Request, resp: Response) => {
  const userId = Number(req.body.userId);
  const { coins } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { coins: { increment: coins } },
    });
    return resp.status(200).json({ message: "Compra exitosa", user: updatedUser });
  } catch (error) { return resp.status(500).json({ error: "Error compra" }); }
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});