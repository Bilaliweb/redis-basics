import Redis from "ioredis";
import mongoose from "mongoose";
import express from "express";

const app = express()

// Creating a Redis Client
// Redis url will connect to our 'docker compose up'
const redis = new Redis(process.env.REDIS_PORT || 'redis://localhost:6379')
console.log("Check Redis: ", redis);

// Pinging Redis for getting a reply from Redis
app.get('/redis', async (req, res) => {
    const reply = await redis.ping();
    res.json({ redis: reply, details: redis })
})

// Route for MongoDB connection
app.get('/mongo', async (req, res) => {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/redis_practice'

    if(mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUrl)
    }

    res.json({ mongoDb: 'connected', databaseName: mongoose.connection.name })
})

// Server PORT listening
app.listen(3000, () => {
    console.log("Server running on port: ", `http://localhost:3000`);
})