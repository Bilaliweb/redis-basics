import express from "express";
import Redis from "ioredis";

const app = express()
app.use(express.json())

const redis = new Redis(process.env.REDIS_PORT || 'redis://localhost:6379')

// Redis connection error handling
redis.on('error', (err) => {
    console.error('Redis connection error here: ', err);
})

/**
 * 2 ways for storing objects such as user profile in Redis:
 * - json with set()
 * - hash with hset()
 * */

// With JSON using set()
app.post('/user/:id/json', async (req, res) => {
    const storeObject = await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body))
    res.json({ success: true, data: storeObject })
})

// Now get that object using .get()
app.get('/user/:id/json', async (req, res) => {
    const getObject = await redis.get(`user:${req.params.id}:json`)
    console.log("Get object: ", getObject);
    
    res.json({ data: JSON.parse(getObject) })
})

// With Hash using hset()
app.post('/user/:id/hash', async (req, res) => {
    
    // Using hset() doesn't require to store data from req.body by coverting through JSON.stringify()
    const storeObject = await redis.hset(`user:${req.params.id}:hash`, req.body)
    res.json({ success: true, data: storeObject })
})

// Now Get stored hash object
app.get('/user/:id/hash', async (req, res) => {

    // hgetall() will fetch entire object and doesn't require parsing
    const getObject = await redis.hgetall(`user:${req.params.id}:hash`)
    res.json({ data: getObject })
})

app.listen(3000, () => {
    console.log('Server running on: http://localhost:3000');
    
})