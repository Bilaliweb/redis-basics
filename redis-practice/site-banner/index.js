import express from "express";
import Redis from "ioredis";

const app = express()
app.use(express.json())

const redis = new Redis(process.env.REDIS_PORT || 'redis://localhost:6379')

// Redis connection error handling
redis.on('error', (err) => {
    console.error('Redis connection error here: ', err);
})

// Banner Key for Redis
const BANNER_KEY = "app:banner" // One of the standard way for writing the key

// Setting a value on banner in Redis for interaction with Banner key
app.post('/banner', async (req, res) => {

    // Seting up key value pair using .set()
    const response = await redis.set(BANNER_KEY, req.body.message || "Welcome to Redis practice.")
    res.json({ success: true, data: response })
})

// Getting a value from Redis
app.get('/banner', async (req, res) => {
    
    const response = await redis.get(BANNER_KEY);

    if(!response) return res.json({ error: 'Value not found' })
    
    res.json({ data: response })
})

// Delete a value from Redis
app.delete('/banner', async (req, res) => {
    await redis.del(BANNER_KEY)
    res.json({ success: true })
})

// Route to check if value in Redis exists or not
app.get('/banner/exists', async (req, res) => {
    const ifExists = await redis.exists(BANNER_KEY)
    console.log("If key exists: ", ifExists);

    res.json({ exists: Boolean(ifExists) })
})

// Server listening to port
app.listen(3500, () => {
    console.log('Server listening to port: ', `http://localhost:3500`);
    
})