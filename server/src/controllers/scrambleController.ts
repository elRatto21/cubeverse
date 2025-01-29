// src/controllers/authController.ts
import { Request, Response } from "express";

import { Scrambow } from "scrambow";

export interface ScrambleQuery {
    count?: string;
    type?: string;
  }

export const scrambleController = {
  scramble: async (req: Request<ScrambleQuery>, res: Response) => {
    try {
      const cube = new Scrambow();

      let count = 1;
      if(req.query.count) {
        count = parseInt(req.query.count as string);
      }
      const scramblesRaw = cube.get(count);

      let scrambles = scramblesRaw.reduce((acc: string[], curr) => {
        acc.push(curr.scramble_string);
        return acc;
      }, []);

      return res.status(200).json({ scrambles });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({ message: "Registration failed" });
    }
  },
};
