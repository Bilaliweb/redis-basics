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
    console.log(`Message received on ${channel}: ${message}`);
    const parsedMessage = JSON.parse(message)
    console.log('Parsed message: ', parsedMessage);
    

    // Logic for increase
    const increasedCount = await redis.hincrby(parsedMessage.key, parsedMessage.toIncrease, parsedMessage.increaseCountBy)
    console.log('Increased count: ', increasedCount);
})