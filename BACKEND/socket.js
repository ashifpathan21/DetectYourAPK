// 📁 socket.js
import { Server as socketIo } from "socket.io";
import { config } from "dotenv";
config();
let io;
// store id -> socketId mapping in memory (no DB)
const userSockets = new Map();

// 🔌 Initialize Socket.IO
function initializeSocket(server) {
  io = new socketIo(server, {
    cors: {
      origin: ["http://localhost:5173", process.env.FRONTEND_URL],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // console.log("🔌 New client connected:", socket.id);

    // ✅ Join with a unique clientId (nanoid or custom id)
    socket.on("join", ({ clientId }) => {
      // console.log(clientId)
      userSockets.set(clientId, socket.id);
      socket.clientId = clientId;
      // console.log(`✅ Client joined: ${clientId}, Socket ID: ${socket.id}`);
    });

    // ❌ Disconnect user
    socket.on("disconnect", () => {
      if (socket.clientId) {
        userSockets.delete(socket.clientId);
        // console.log(`🛑 Client disconnected: ${socket.clientId}`);
      }
    });
  });
}

// 📤 Send APK analysis status update
function sendApkStatus(clientId, status, extraData = {}) {
  if (!io) throw new Error("Socket not initialized!");
  const socketId = userSockets.get(clientId);
  if (!socketId) return;

  io.to(socketId).emit("apkStatus", {
    clientId,
    status, // e.g. "uploading", "extracting", "parsing"
    ...extraData,
    timestamp: new Date(),
  });
}

export { initializeSocket, sendApkStatus };
