import { getMainClient } from "../config/redis.js";

const redis = getMainClient();

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

    const userId = req.params.id
    const key = `leaderboardUser:user${userId}`
    const userResultById = await redis.exists(key)
    const increaseCountBy = 1
    
    if(!userResultById) return res.json({ err: 'User not found.' })
    
    // Message to publish. (Message can be anything either simple string or object as below.)
    const payload = {
        userId,
        key,
        toIncrease: 'views',
        increaseCountBy,
        createdAt: new Date().toISOString()
    }

    // Publish the message(payload) to specific/relevant channel. i.e; notifications
    const publishToChannel = await redis.publish("views", JSON.stringify(payload))
    console.log("Check how it got published: ", publishToChannel);

    // Error handling for false result
    // if(!publishToChannel) return res.json({ err: 'Error while sending message.' })

    // Send response on success
    res.redirect('/leaderboard')
}

export async function increaseUserScoreCount(req, res) {

    const userId = req.params.id
    const key = `leaderboardUser:user${userId}`
    const userResultById = await redis.exists(key)
    const increaseCountBy = 5
    
    if(!userResultById) return res.json({ err: 'User not found.' })

    // Message to publish. (Message can be anything either simple string or object as below.)
    const payload = {
        userId,
        scoreKey: 'leaderboard:scores',
        increaseCountBy,
        createdAt: new Date().toISOString()
    }

    // Publish the message(payload) to specific/relevant channel. i.e; notifications
    const publishToChannel = await redis.publish("scores", JSON.stringify(payload))
    console.log("Check how it got published: ", publishToChannel);
    
    res.redirect('/leaderboard')
}