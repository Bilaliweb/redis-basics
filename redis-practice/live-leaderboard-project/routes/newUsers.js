import { Router } from "express";
import { getAllUsersFromRedis, getNewSeededUserData, newUsersForRedis } from "../controllers/newUsers.js";

export const newUsersRouter = Router()

newUsersRouter.get('/', getAllUsersFromRedis)
newUsersRouter.get('/:id', getNewSeededUserData)
newUsersRouter.post('/create', newUsersForRedis)