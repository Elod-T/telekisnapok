require("dotenv").config();
const io = require("socket.io")(3001, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("update", (electionId) => {
    console.log("update", electionId);
    socket.broadcast.emit("update", electionId);
  });

  socket.on("disconnect", () => {
    console.log(socket.id, " disconnected");
  });
});
