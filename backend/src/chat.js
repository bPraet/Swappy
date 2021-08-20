const chatInit = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
    maxHttpBufferSize: 1e8,
  });

  io.on("connection", (socket) => {
    console.log(socket.id + " connected");

    socket.on("join", (users) => {
      const split = users.split(",");
      const unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1));
      const roomName = `${unique[0]} et ${unique[1]}`;

      socket.join(roomName);

      socket.on(`emitMessage`, (message) => {
        socket.to(roomName).emit("onMessage", message);
      });

      socket.on("isWriting", (pseudo) => {
        socket
          .to(roomName)
          .emit("isWriting", `${pseudo} est en train d'écrire`);
      });

      socket.on("disconnect", () => {
        console.log(socket.id + " disconnected");
        socket.removeAllListeners();
      });
    });
  });
};

module.exports = { chatInit };
