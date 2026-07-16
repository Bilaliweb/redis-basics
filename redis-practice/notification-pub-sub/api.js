import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json())

// Redis instance
const publisher = new Redis(process.env.REDIS_PORT || 'redis://localhost:6379') 

// Route for sending notification
app.post('/notification', async (req, res) => {
    // Message to publish. (Message can be anything either simple string or object as below.)
    const payload = {
        title: req.body.title,
        purpose: req.body.purpose,
        createdAt: new Date().toISOString()
    }

    // Publish the message(payload) to specific/relevant channel. i.e; notifications
    const publishToChannel = await publisher.publish("notifications", JSON.stringify(payload))
    // console.log("Check how it got published: ", publishToChannel);

    // Error handling for false result
    if(!publishToChannel) return res.json({ err: 'Error while sending message.' })

    // Send response on success
    res.json({ msg: `Message sent to Notifications channel: ${publishToChannel}` })
})

// Server listening
app.listen(3000, () => {
    console.log('Server listening to http://localhost:3000'); 
})