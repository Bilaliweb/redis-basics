import { getMainClient } from "../config/redis.js";
import { setUser } from "../services/jwt.js";

const redis = getMainClient();

export async function userSignUp(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.render('auth/register', { error: 'All fields are required.' });
    }

    const userCreds = {
        username,
        email,
        password
    };

    // Store created user in Redis
    const user = await redis.hset(`leaderboard:userStore:${email}`, userCreds);
    // console.log('User registered successfully: ', email);

    return res.redirect('/login');
}

export async function userLogIn(req, res) {
    console.log('Login attempt: ', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('auth/login', { error: 'Email and password are required.' });
    }

    // 1. Fetch user by email from Redis
    const loginUser = await redis.hgetall(`leaderboard:userStore:${email}`);
    console.log('Login user: ', loginUser);
    
    
    // Redis hgetall returns empty object if key doesn't exist
    if (!loginUser || Object.keys(loginUser).length === 0) {
        return res.render('auth/login', { error: 'Invalid email or password.' });
    }

    // 2. Validate password
    if (loginUser.password !== password) {
        return res.render('auth/login', { error: 'Invalid email or password.' });
    }

    // 3. Generate token with user payload
    const token = setUser({
        username: loginUser.username,
        email: loginUser.email
    });
    console.log('Authentication successful. Token created: ', token);

    // 4. Set the HTTP-only cookie and redirect to the leaderboard
    res.cookie('token', token, { httpOnly: true });
    return res.redirect('/leaderboard');
}

export function userLogOut(req, res) {
    res.clearCookie('token');
    return res.redirect('/login');
}