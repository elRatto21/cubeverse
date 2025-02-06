import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from 'express';
import { getToken } from "../utils/token";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getToken(req.headers.cookie ?? "")
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = authMiddleware;