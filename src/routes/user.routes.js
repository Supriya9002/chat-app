import express from "express";
import {
  getMe,
  getUserById,
  login,
  refreshToken,
  register,
  searchUser,
} from "../controllers/auth.controller.js";

const UserRouter = express.Router();

UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.post("/refresh", refreshToken);
UserRouter.post("/me", getMe);
UserRouter.post("/users", searchUser);
UserRouter.post("/users/:id", getUserById);

export default UserRouter;
