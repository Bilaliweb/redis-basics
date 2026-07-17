import jwt from "jsonwebtoken";
const secret = 'jwtsecretfor:leaderboard'

export function setUser(user) {
    return jwt.sign(user, secret)
}

export function getUser(token) {
    try {
        return jwt.verify(token, secret)
    }
    catch (e) {
        console.error('Error while getting user: ', e);
        return null
    }
}