export function listenSocket(io) {
  // create a namespace for pong game. need to use this in frontend
  const pongNameSpace = io.of("/pong");
  let totalRoom = 0;
  pongNameSpace.on("connection", (socket) => {
    let room;
    const totalPlayers = io.engine.clientsCount;
    socket.on("ready", (nameData) => {
      console.log(nameData + " Player is Connected Now");
      room = "room " + Math.floor(totalRoom / 2);
      socket.join(room);
      totalRoom++;
      console.log("User id " + nameData + " joined " + room);
      if (totalPlayers % 2 == 0) {
        pongNameSpace.to(room).emit("playerCount", totalPlayers);
        setTimeout(() => {
          pongNameSpace.in(room).emit("startGame", nameData, totalPlayers);
        }, 1000);
      }
      console.log(totalPlayers);
    });
    socket.on("playAgain", (response) => {
      console.log(response);
      if (response.response == "yes") {
        let nameData = response.nameData;
        setTimeout(() => {
          pongNameSpace.to(room).emit("restartGame", nameData, totalPlayers);
        }, 1000);
      } else if (response.response == "start") {
        console.log("Reached Ready condition ");
        socket.to(room).emit("playAgain", response.myName);
      } else if ((response.response = "no")) {
        console.log("The Request Has been Rejected");
      }
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
