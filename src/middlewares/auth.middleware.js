import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
const AuthMiddleware = async (req, res, next) => {
  try {
    // 1️ Get token from header
    const authHeader = req.headers.authorization;
    console.log("authHeader", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    const token = authHeader.split(" ")[1];
    // 2️ Verify access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️ Find user
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    // 4️ Attach user to request
    req.user = user;
    req.userID = user._id;

    next();
  } catch (err) {
    next(err);
  }
};

export default AuthMiddleware;
