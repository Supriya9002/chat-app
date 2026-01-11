import "./env.js";
import express from "express";
const app = express();
import connectUsingMongoose from "./src/config/db.js";

app.get("/", (req, res) => {
  res.send("Welcome to Chat App");
});

app.listen(process.env.PORT, async () => {
  await connectUsingMongoose();
  console.log(`Server Listen in ${process.env.PORT} Port`);
});
