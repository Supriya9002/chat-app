import express from "express";
import {
  getMe,
  getUserById,
  login,
  refreshToken,
  register,
  searchUser,
} from "../controllers/auth.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

const UserRouter = express.Router();

UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.post("/refresh", refreshToken);
UserRouter.get("/me", AuthMiddleware, getMe);
UserRouter.get("/users", searchUser);
UserRouter.get("/users/:id", getUserById);

export default UserRouter;
