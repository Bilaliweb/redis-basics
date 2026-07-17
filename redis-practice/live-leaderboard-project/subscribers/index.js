// import Redis from "ioredis"
// import { viewSub } from "./views.js";
// import { scoreSub } from "./scores.js";

// export const subscriber = new Redis(process.env.REDIS_PORT || 'redis://localhost:6379')

// export const startAllSubscribers = async () => {
//     try {
//         console.log("🚀 Initializing all background workers...");

//         // Fire off all subscription loops simultaneously
//         await Promise.all([
//             viewSub,
//             scoreSub
//             // initPaymentSub()
//         ]);

//         console.log("✅ All background subscribers are listening cleanly.");
//     } catch (error) {
//         console.error("❌ Failed to initialize subscribers:", error);
//         process.exit(1);
//     }
// };

// // If this specific file is executed directly via terminal, run the workers
// // if (require.main === module) {
// //     startAllSubscribers();
// // }

// subscribers/index.js
import "./views.js";
import "./scores.js";

console.log("✅ All background subscribers are listening.");