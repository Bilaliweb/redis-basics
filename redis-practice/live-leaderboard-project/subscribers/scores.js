import { createSubscriberClient } from "../config/redis.js";
import { redis } from "../index.js";

export const scoreSub = createSubscriberClient();

scoreSub.subscribe("scores", (err) => {
    if(err) {
        console.log("Failed to subscribe.", err.message);
        return;
    }
    console.log("Subscribed scores successfully.");
})

// Will listen to this event only if message is recevied and logic will execute
scoreSub.on('message', async (channel, message) => {

    const parsedMessage = JSON.parse(message)
    // Logic for increase
    await redis.zincrby(parsedMessage.scoreKey, parsedMessage.increaseCountBy, parsedMessage.userId)
})