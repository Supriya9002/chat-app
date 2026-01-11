import "./env.js";
import express from "express";
import http from "http";
import bodyParser from "body-parser";

import connectUsingMongoose from "./src/config/db.js";
import { initSocket } from "./src/config/socket.js";
import chatSocket from "./src/sockets/chat.socket.js";

import UserRouter from "./src/routes/user.routes.js";
import errorHandler from "./src/middlewares/error.middleware.js";

const app = express();

/* ---------- HTTP + SOCKET SERVER ---------- */
const server = http.createServer(app);
const io = initSocket(server);

/* ---------- SOCKET CONNECTION ---------- */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  chatSocket(socket);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* ---------- MIDDLEWARES ---------- */
app.use(bodyParser.json());

/* ---------- ROUTES ---------- */
app.use("/api/auth", UserRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Chat App");
});

/* ---------- ERROR HANDLER ---------- */
app.use(errorHandler);

/* ---------- SERVER START ---------- */
server.listen(process.env.PORT, async () => {
  await connectUsingMongoose();
  console.log(`Server running on port ${process.env.PORT}`);
});
