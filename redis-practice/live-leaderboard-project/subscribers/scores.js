import { createSubscriberClient } from "../config/redis.js";

export const scoreSub = createSubscriberClient();

scoreSub.subscribe("scores", (err) => {
    if(err) {
        console.log("Failed to subscribe.", err.message);
        return;
    }
    console.log("Subscribed scores successfully.");
})

// Will listen to this event only if message is recevied and logic will execute
scoreSub.on('message', (channel, message) => {
    console.log(`Message received on ${channel}: ${message}`);
})