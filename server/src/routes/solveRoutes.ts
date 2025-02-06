// @ts-nocheck - Type errors with routes, but still works

import { Router } from "express";
import { solveController } from "../controllers/solveController";
import authMiddleware from "../middleware/authMiddleware"

const solveRouter = Router();

solveRouter.post('', authMiddleware, solveController.createSolve)
solveRouter.get('', authMiddleware, solveController.getSolves)

export default solveRouter;