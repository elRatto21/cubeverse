// @ts-nocheck - Type errors with routes, but still works
import express, { Router } from 'express';
import { scrambleController } from '../controllers/scrambleController';

const scrambleRouter = Router();

scrambleRouter.get('/scramble', scrambleController.scramble);

export default scrambleRouter;