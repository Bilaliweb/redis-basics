import { getUser } from "../services/jwt.js";

export function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies?.[cookieName];
        if (!tokenCookieValue) {
            return next();
        }

        try {
            const userPayload = getUser(tokenCookieValue);
            if (userPayload) {
                req.user = userPayload;
                res.locals.currentUser = userPayload; // Expose user info to EJS templates
            }
        } catch (e) {
            console.error("Error in auth middleware token parsing:", e);
        }

        return next();
    };
}
