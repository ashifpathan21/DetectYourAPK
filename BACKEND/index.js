import http from "http"
import app from './server.js'
import {initializeSocket} from "./socket.js"
import {config } from "dotenv"
config()


const PORT = process.env.PORT || 4000;

const server = http.createServer(app); // Create server from express app ✅


initializeSocket(server); // Initialize socket on the same server ✅

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
