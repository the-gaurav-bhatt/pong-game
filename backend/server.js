import { createServer } from "http";
import { api } from "./api.js";
import { listenSocket } from "./socket.js";
import { Server } from "socket.io";
const pongServer = createServer(api);
const io = new Server(pongServer);
listenSocket(io);

const PORT = 3000;
pongServer.listen(PORT);
console.log("Listening on port :" + PORT);
