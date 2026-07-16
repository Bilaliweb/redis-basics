import Redis from 'ioredis';

// Redis instance
const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/** 
 * What to subscribe either notifications, emails or orders etc
 * We can say that we have created a channel here for notifications
 * We can create as many subscribers as we want as per requirements/needs
 * */ 
subscriber.subscribe("notifications", (err) => {
    if(err) {
        console.log("Failed to subscribe.", err.message);
        return;
    }
    console.log("Subscribed successfully.");
})

// Will listen to this event only if message is recevied
subscriber.on('message', (channel, message) => {
    console.log(`Message received on ${channel}: ${message}`);
})