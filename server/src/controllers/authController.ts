// src/controllers/authController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { RegisterRequest, LoginRequest, UserResponse } from "../types/auth";

export const authController = {
  register: async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
    try {
      const { username, password } = req.body;

      const existingUser = await User.findOne({
        $or: [{ username }],
      });

      if (existingUser) {
        return res.status(400).json({
          message:
            existingUser.username === username && "Username already taken",
        });
      }

      const user = await User.create({
        username,
        password,
      });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        domain: process.env.NODE_ENV === "production" ? "ntrapp.net" : "localhost",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const userResponse: UserResponse = {
        id: user._id as string,
        username: user.username,
      };

      return res.status(201).json({ user: userResponse });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({ message: "Registration failed" });
    }
  },

  login: async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        domain: process.env.NODE_ENV === "production" ? "ntrapp.net" : "localhost",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const userResponse: UserResponse = {
        id: user._id as string,
        username: user.username,
      };

      return res.json({ user: userResponse });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Login failed" });
    }
  },

  logout: async (req: Request, res: Response) => {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      domain: "ntrapp.net",
      path: "/",
      expires: new Date(0)
    });
    
    return res.json({ message: "Logged out successfully" });
  },
};
