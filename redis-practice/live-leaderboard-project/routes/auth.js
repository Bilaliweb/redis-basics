import { Router } from "express";
import { userSignUp, userLogIn, userLogOut } from "../controllers/auth.js";

export const authRouter = Router();

// Redirect root to leaderboard
authRouter.get('/', (req, res) => {
    return res.redirect('/leaderboard');
});

// User Sign up (GET & POST)
// For EJS
authRouter.get('/signup', (req, res) => {
    return res.render('auth/register');
});
// For Controller
authRouter.post('/signup', userSignUp);

// User Login (GET & POST)
// For EJS
authRouter.get('/login', (req, res) => {
    return res.render('auth/login');
});
// For Controller
authRouter.post('/login', userLogIn);

// User Logout
authRouter.get('/logout', userLogOut);