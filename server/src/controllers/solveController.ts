import { Request, Response } from "express";
import { SolveRequest } from "../types/solve";
import { Solve } from "../models/Solve";
import { getUserFromCookie } from "../utils/token";

export const solveController = {
  createSolve: async (req: Request<SolveRequest>, res: Response) => {
    try {
      const { time, scramble, event } = req.body;

      if (!req.headers.cookie) {
        return res.status(401).json({ message: "Token is missing" });
      }

      const userId = getUserFromCookie(req.headers.cookie);

      const newSolve = await Solve.create({
        user_id: userId,
        time: time,
        scramble: scramble,
        event: event,
        dnf: false,
        plusTwo: false,
      });

      return res
        .status(201)
        .json({ message: "Solve created", object: newSolve });
    } catch (e) {
      console.warn(e);
      return res
        .status(500)
        .json({ message: "Something went wrong, try again." });
    }
  },

  getSolves: async (req: Request, res: Response) => {
    try {

        console.log(req.query)

        let limit = parseInt(req.query.limit as string)

        const event = req.query.event

        if (event === undefined) {
            return res.status(500).json({ message: "Event is missing" })
        }

        if (limit !== undefined) {
            limit = 30
        }

        const user_id = getUserFromCookie(req.headers.cookie ?? "")

        let rawData: any[] = [];

        switch(event) {
            case "3x3":
                rawData = await Solve.find({ event, user_id }).sort({ createdAt: -1 }).limit(limit)
        }

        const data = rawData.map(solve => solve.toObject())

        return res.status(200).json({ data })
    } catch (e) {
        console.warn(e);
        return res
          .status(500)
          .json({ message: "Something went wrong, try again." });
      }
  },
};
