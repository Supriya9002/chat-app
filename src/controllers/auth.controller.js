import ApplicationError from "../error/error.applicationError.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    logger.info("Register attempt", { email });
    const exits = await UserModel.findOne({ email });
    if (exits) {
      logger.warn("Register failed: user already exists", { email });
      throw new ApplicationError("User Already exits", 404);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: hashPassword,
    });
    logger.info("User registered successfully", { userId: user._id });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    logger.error("Login error", { message: err.message });
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    logger.info("Login attempt", { email });
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      logger.warn("Login failed: user not found", { email });
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn("Login failed: password mismatch", { email });
      throw new ApplicationError("User Password Not Matching", 404);
    }
    const AccessToken = await generateAccessToken(user._id);
    const RefreshToken = await generateRefreshToken(user._id);
    user.refreshTokens.push({ token: RefreshToken });
    await user.save();

    logger.info("Login successful", { userId: user._id });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      AccessToken,
      RefreshToken,
    });
  } catch (err) {
    logger.error("Login error", { message: err.message });
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    logger.info("Refresh token request");
    if (!refreshToken) {
      logger.warn("Refresh token missing");
      return res.status(400).json({ message: "Refresh token required" });
    }
    // verify refresh token
    const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    // find user with this refresh token
    const user = await UserModel.findOne({
      _id: decode.userId,
      "refreshTokens.token": refreshToken,
    });
    if (!user) {
      logger.warn("Invalid refresh token used", { userId: decode.userId });
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    // generate new tokens
    const newAccessToken = await generateAccessToken(user._id);
    const newRefreshToken = await generateRefreshToken(user._id);

    // remove old refresh token (rotation)
    user.refreshTokens = user.refreshTokens.filter(
      (t) => t.token !== refreshToken
    );

    // save new refresh token
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    logger.info("Refresh token rotated", { userId: user._id });

    res.status(201).json({
      success: true,
      message: "new Refresh token generate successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    logger.error("Refresh token error", { message: err.message });
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userid = req.userID;
    logger.info("Get profile request", { userId });

    const user = await UserModel.findById(userid).select("-refreshTokens");
    res.status(200).json({
      success: true,
      message: "User Profile fetch successfully",
      user,
    });
  } catch (err) {
    logger.error("Refresh token error", { message: err.message });
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
  } catch (err) {
    logger.error("Refresh token error", { message: err.message });
    next(err);
  }
};

export const searchUser = async (req, res, next) => {
  try {
  } catch (err) {
    logger.error("Refresh token error", { message: err.message });
    next(err);
  }
};
