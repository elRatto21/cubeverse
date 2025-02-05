import { Router } from "express";
import { solveController } from "../controllers/solveController";

const solveRouter = Router();

solveRouter.post('', solveController.createSolve)

export default solveRouter;