import { redis } from "../index.js";

export async function newUsersForRedis(req, res) {

    console.log('Type of req body and lenght: ', typeof(req.body), req.body.length);

    if(Array.isArray(req.body)) {
        for (const user of req.body) {
            // Setting key and value for each user
            await redis.hset(`leaderboardUser:user${user.id}`, {
                username: user.username,
                email: user.email,
                password: user.password, // Remember to hash this in your actual register route!
                views: user.views
            })

            // Store score in a Sorted Set for the leaderboard
            // ioredis: zadd(key, score, member) — not the object syntax used by node-redis
            await redis.zadd('leaderboard:scores', user.score ?? user.views, user.id)
        }
    }
    else {
        return res.json({ err: 'Provide JSON in array.' })
    }

    res.json({ success: true, msg: `All 50 users seeded successfully` })
}

export async function getNewSeededUserData(req, res) {
    const wholeUserData = await redis.hgetall(`leaderboardUser:user${req.params.id}`)
    
    if(!wholeUserData) return res.json({ err: 'Requested user not found.' })
    
    res.json({ success: true, data: wholeUserData })
}

export async function fetchLeaderboardUsers() {
    // Fetching User IDs by providing start and last index from a sorted set
    const userIds = await redis.zrevrange('leaderboard:scores', 0, -1);

    // Build full user objects for the template
    const users = await Promise.all(
        userIds.map(async (id) => {
            const profile = await redis.hgetall(`leaderboardUser:user${id}`);
            const score = await redis.zscore('leaderboard:scores', id);
            return {
                id,
                username: profile.username,
                views: profile.views,
                score: Number(score),
            };
        })
    );

    return users;
}

export async function getAllUsersFromRedis(req, res) {
    const allUsers = await fetchLeaderboardUsers()
    console.log('All users: ', allUsers);
    res.json({ success: true, data: allUsers })
}

export async function increaseUserViewCount(req, res) {
    // TODO: Add Pub-Sub logic to update UI without refresh. Below logic will be shifted to subscriber and this will be updated as publisher
    const userId = req.params.id
    const key = `leaderboardUser:user${userId}`
    const userResultById = await redis.exists(key)
    console.log('Check fetched user for view: ', userResultById);
    
    if(!userResultById) return res.json({ err: 'User not found.' })

    const increasedCount = await redis.hincrby(key, 'views', 1)
    console.log('Increased count: ', increasedCount);
    
    res.redirect('/leaderboard')
}