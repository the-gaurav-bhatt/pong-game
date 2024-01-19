export function listenSocket(io) {
  // create a namespace for pong game. need to use this in frontend
  const pongNameSpace = io.of("/pong");
  let totalRoom = 0;
  let totalReadyPlayer = 0;
  let rooms = {};
  // let player = [];
  pongNameSpace.on("connection", (socket) => {
    let room;
    socket.on("ready", (nameData) => {
      totalReadyPlayer++;
      // player.push(nameData);
      console.log(nameData + " Player is Connected Now");
      room = "room " + Math.floor(totalRoom / 2);
      if (!rooms[room]) {
        rooms[room] = [];
      }

      rooms[room].push(nameData);

      socket.join(room);
      totalRoom++;
      console.log("User id " + nameData + " joined " + room);
      if (totalReadyPlayer % 2 == 0) {
        // player = [];
        pongNameSpace.to(room).emit("playerCount", totalReadyPlayer);
        setTimeout(() => {
          pongNameSpace.in(room).emit("startGame", rooms[room]);
        }, 1000);
      }
      console.log(rooms);
      console.log(totalReadyPlayer);
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
      if (totalReadyPlayer > 0) {
        totalReadyPlayer--;
      }
    });
    socket.on("gameOver", (nameData) => {
      socket.leave(room);
      console.log("Game over. Player " + nameData + " has Left The room");
      if (totalReadyPlayer > 0) {
        totalReadyPlayer--;
      }
    });
  });
}
