import { createSubscriberClient } from "../config/redis.js";
import { redis } from "../index.js";

export const viewSub = createSubscriberClient();

viewSub.subscribe("views", (err) => {
    if(err) {
        console.log("Failed to subscribe.", err.message);
        return;
    }
    console.log("Subscribed views successfully.");
})

// Will listen to this event only if message is recevied and logic will execute
viewSub.on('message', async (channel, message) => {

    const parsedMessage = JSON.parse(message)    
    // Logic for increase
    await redis.hincrby(parsedMessage.key, parsedMessage.toIncrease, parsedMessage.increaseCountBy)
})