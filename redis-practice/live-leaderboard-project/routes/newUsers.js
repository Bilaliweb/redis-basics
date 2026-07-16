import { Router } from "express";
import { getAllUsersFromRedis, getNewSeededUserData, increaseUserViewCount, newUsersForRedis } from "../controllers/newUsers.js";

export const newUsersRouter = Router()

newUsersRouter.get('/', getAllUsersFromRedis)
newUsersRouter.get('/:id', getNewSeededUserData)
newUsersRouter.post('/create', newUsersForRedis)
newUsersRouter.post('/user/:id/view', increaseUserViewCount)