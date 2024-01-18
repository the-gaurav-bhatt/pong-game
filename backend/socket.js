export function listenSocket(io) {
  // create a namespace for pong game. need to use this in frontend
  const pongNameSpace = io.of("/pong");
  let totalRoom = 0;
  pongNameSpace.on("connection", (socket) => {
    let room;
    socket.on("ready", () => {
      console.log(socket.id + " Player is Connected Now");
      const totalPlayers = io.engine.clientsCount;
      room = "room " + Math.floor(totalRoom / 2);
      socket.join(room);
      totalRoom++;
      console.log("User id " + socket.id + " joined " + room);
      if (totalPlayers % 2 == 0) {
        pongNameSpace.in(room).emit("startGame", socket.id);
      }
      console.log(totalPlayers);
    });
    socket.on("ballDetail", (ballDetail) => {
      socket.to(room).emit("realBallDetail", ballDetail);
    });
    socket.on("paddleDetail", (paddleDetail) => {
      socket.to(room).emit("realpaddleDetail", paddleDetail);
    });
    socket.on("scoreUpdate", (scoreDetail) => {
      socket.to(room).emit("realScoreUpdate", scoreDetail);
    });
    socket.on("disconnect", () => {
      console.log("Player" + socket.id + " disconnected from " + room);
      socket.leave(room);
    });
  });
}
