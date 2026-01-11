import "./env.js";
import express from "express";
const app = express();
import connectUsingMongoose from "./src/config/db.js";
import UserRouter from "./src/routes/user.routes.js";
import errorHandler from "./src/middlewares/error.middleware.js";
import bodyParser from "body-parser";

// all middleware
app.use(bodyParser.json());

// routers
app.use("/api/auth", UserRouter)

app.get("/", (req, res) => {
  res.send("Welcome to Chat App");
});

// ❗ MUST BE LAST
app.use(errorHandler);

app.listen(process.env.PORT, async () => {
  await connectUsingMongoose();
  console.log(`Server Listen in ${process.env.PORT} Port`);
});
