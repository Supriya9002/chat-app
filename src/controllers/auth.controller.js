import ApplicationError from "../error/error.applicationError.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    const exits = await UserModel.findOne({ email });
    console.log("exits", exits);
    if (exits) throw new ApplicationError("User Already exits", 404);
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: hashPassword,
    });
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
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select("+password");
    console.log("user", user);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApplicationError("User Password Not Matching", 404);
    const AccessToken = await generateAccessToken(user._id);
    const RefreshToken = await generateRefreshToken(user._id);
    user.refreshTokens.push({ token: RefreshToken });
    await user.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      AccessToken,
      RefreshToken,
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    console.log(refreshToken);
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token required" });
    // verify refresh token
    const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log(decode);
    // find user with this refresh token
    const user = await UserModel.findOne({
      _id: decode.userId,
      "refreshTokens.token": refreshToken,
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    console.log(user);
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

    res.json({
      success: true,
      message: "new Refresh token generate successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

export const searchUser = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
