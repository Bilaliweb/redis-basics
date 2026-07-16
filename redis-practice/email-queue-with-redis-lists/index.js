import express from "express";
import Redis from "ioredis";

const app = express()
app.use(express.json())

const redis = new Redis(process.env.REDIS_PORT || 'redis://localhost:6379')

// Redis connection error handling
redis.on('error', (err) => {
    console.error('Redis connection error here: ', err);
})

// Queue
const QUEUE_KEY = 'queue:emails' // Standard practice of writing keys for queues

// Doing it manually for understanding purpose

// Sending job in specific queue i.e; queue:emails
app.post('/queue/emails', async (req, res) => {
    const job = {
        to: req.body.to,
        from: req.body.from,
        subject: req.body.subject || 'No Subject',
        body: req.body.body || 'No Content',
        createdAt: new Date().toISOString()
    }

    // Send that job to queue from left
    await redis.lpush(QUEUE_KEY, JSON.stringify(job))
    res.json({ success: true, job })
})

// Specific worked will now retrieve job from queue
app.get('/emails/process', async (req, res) => {

    // This will pop the job and will not be in queue anymore
    const getJob = await redis.rpop(QUEUE_KEY)
    
    // Error handling if no job found
    if(!getJob) return res.json({ error: 'Job not found in queue.' })
    
    // Parse before sending or worker picks this job for further logic
    const parsedJob = JSON.parse(getJob)
    res.json({ message: 'Email sent.', job: parsedJob })
})

app.listen(3000, () => {
    console.log('Server running on: http://localhost:3000');
})