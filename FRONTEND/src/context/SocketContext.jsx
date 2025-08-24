// 📁 src/context/SocketContext.jsx
import React, { createContext, useEffect } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

const socket = io(import.meta.env.VITE_BASE_URL, {
  transports: ["websocket"], // Optional, for forcing WebSocket
});

const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.on("connect", () => {
      // console.log("✅ Socket connected (test)");
    });

    socket.on("disconnect", () => {
      // console.log("❌ Socket disconnected (test)");
    });

    return () => {
      socket.disconnect(); // 🧼 Clean up on unmount
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
