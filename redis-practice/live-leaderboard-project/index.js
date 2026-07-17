import express from "express";
import Redis from "ioredis";
import path from 'path';
import { leaderboardRouter } from "./routes/leaderboard.js";
import { newUsersRouter } from "./routes/newUsers.js";
import { getMainClient } from "./config/redis.js";
import { authRouter } from "./routes/auth.js";
import cookieParser from "cookie-parser";
import { checkForAuthenticationCookie } from "./middlewares/auth.js";

const app = express()
const port = 8000
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))

// Templating Engine
app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))


app.use('/', authRouter)
app.use('/leaderboard', leaderboardRouter)
app.use('/newUsers', newUsersRouter)

app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`);
})