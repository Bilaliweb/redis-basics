import { Queue } from "bullmq";

// Connection config
export const connectionRedis = {
    host: 'localhost',
    port: 6379
}

// Create a specific queue for emails
// Note: BullMQ accepts 'connection' in options so only giving shorthand name won't work, instead should write as { connection: connectionConfig }
export const emailQueue = new Queue('emails', { connection: connectionRedis })

// Multiple queues can be created here.