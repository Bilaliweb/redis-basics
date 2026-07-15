import express from "express";
import { emailQueue } from "./queue.js";

const app = express()
app.use(express.json())

// Post route for basic Welcome email job
app.post('/welcome-email', async (req, res) => {
    const emailJob = await emailQueue.add(
        // Job name what user wants or has requested to do
        'send-welcome-email',
        req.body || 'No Body Content',
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2500
            }
        }
    )
    res.json({ msg: 'Welcome email job added to queue', jobData: emailJob })
})


app.listen(3500, () => {
    console.log('Server listening to: http://localhost:3500');  
})