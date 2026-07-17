import express from "express";
import Redis from "ioredis";
import path from 'path';
import { leaderboardRouter } from "./routes/leaderboard.js";
import { newUsersRouter } from "./routes/newUsers.js";
import { getMainClient } from "./config/redis.js";

const app = express()
const port = 8000
app.use(express.json())

// Redis Instance and can be used in multiple files as per need
export const redis = getMainClient()

// Templating Engine
app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))


app.use('/leaderboard', leaderboardRouter)
app.use('/newUsers', newUsersRouter)

app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`);
})