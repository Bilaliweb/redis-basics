import { Router } from "express";
import { getLeaderboard } from "../controllers/leaderboard.js";

export const leaderboardRouter = Router()

leaderboardRouter.get('/', getLeaderboard)