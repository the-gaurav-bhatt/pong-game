import { createServer } from "http";
import { Server } from "socket.io";
const pongServer = createServer();
const io = new Server(pongServer, {
  cors: {
    origin: "http://127.0.0.1:5500",
  },
});
io.on("connection", (socket) => {
  socket.on("ready", () => {
    console.log(socket.id + " Player is Connected Now");

    const totalPlayers = io.engine.clientsCount;
    if (totalPlayers % 2 == 0) {
      io.emit("startGame", socket.id);
    }
    console.log(totalPlayers);
  });
  socket.on("ballDetail", (ballDetail) => {
    socket.broadcast.emit("realBallDetail", ballDetail);
  });
  socket.on("paddleDetail", (paddleDetail) => {
    socket.broadcast.emit("realpaddleDetail", paddleDetail);
  });
  socket.on("scoreUpdate", (scoreDetail) => {
    socket.broadcast.emit("realScoreUpdate", scoreDetail);
  });
});

const PORT = 3000;
pongServer.listen(PORT);
console.log("Listening on port :" + PORT);
