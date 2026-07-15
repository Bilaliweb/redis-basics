import { Worker } from "bullmq";
import { connectionRedis } from "./queue.js";

/**
 * Workers are also known as Consumers cuz these are the ones which will be hanlding the tasks from Producers (means APIs)
 * 
 * 3 properties are there which Worker requires to start working.
 * - Name of specific queue
 * - Job's Business Logic
 * - Redis Connection
 */

// Creating instance and providing all 3 required properties: name, logic, connection
const emailWorker = new Worker(
    'emails', // There can be multiple queues and we are picking the queue for emails
    async (job) => {
        console.log('Processing email job: ', job.id, job.name, job.data);
        // Job will be resolved after 1.5s and will log the result from 'completed' listener event
        await new Promise((resolve) => setTimeout(() => resolve(job), 1500));
        console.log('Email job completed successfully.', job.id, job.name, job.data);
    },
    { connection: connectionRedis }
)

// Listening Events for workers
// For success
emailWorker.on('completed', (job) => {
    console.log('Job event completed.', job.id, job.name, job.data);
})

// For failure
emailWorker.on('failed', (job) => {
    console.log('Job event failed.', job.id, job.name, job.data);
})