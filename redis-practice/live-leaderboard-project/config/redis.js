import Redis from "ioredis";

let mainClientInstance = null;

// Shares 1 standard connection for commands and publishing
export const getMainClient = () => {
  if (!mainClientInstance) {
    mainClientInstance = new Redis(process.env.REDIS_PORT || 'redis://localhost:6379');
    console.log("🔄 Redis Main Client Connected");
  }
  return mainClientInstance;
};

// Instantiates a brand new connection specifically for subscribing
export const createSubscriberClient = () => {
  console.log("🔌 New Redis Subscriber Connection Created");
  return new Redis(process.env.REDIS_PORT || 'redis://localhost:6379');
};