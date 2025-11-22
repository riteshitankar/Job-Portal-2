// import { createClient } from "redis"
// import dotenv from "dotenv"

// dotenv.config({ path: "./config.env" })

// const redisClient = createClient({
//     url: process.env.REDIS_URL
// })

// redisClient.on("error", (err) => {
//     console.log("redis error : ", err)
// })

// try {
//     await redisClient.connect();
//     console.log("successfully conected to redis client !")
// } catch (err) {
//     console.log("unable to connect with redis client : ", err)
// }

// export { redisClient }

// // to store a temp data(otp)




// server/utils/redisClient.js
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error:", err);
});

// Connect once
(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis successfully!");
  } catch (err) {
    console.log("Failed to connect to Redis:", err);
  }
})();

export { redisClient };