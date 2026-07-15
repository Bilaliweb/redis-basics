import express from "express";
import Redis from "ioredis";

const app = express()
app.use(express.json())

const redis = new Redis(process.env.REDIS_PORT || 'redis://localhost:6379')

// Redis connection error handling
redis.on('error', (err) => {
    console.error('Redis connection error here: ', err);
})

// Standard way for storing a key in Redis is by using a method/function
function otpKey(phone) {
    return `otp:${phone}`
}

// Route for creating otp and setting in Redis
app.post('/otp', async (req, res) => {
    const { phone } = req.body;
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Setting key and value in Redis along with expiry time
    const response = await redis.set(otpKey(phone), randomOtp, 'EX', 30)
    res.json({ msg: 'OTP created and stored in REDIS', data: randomOtp })
})

// Verify OTP and delete on success
app.get('/otp/verify', async (req, res) => {
    const { phone, otp } = req.body

    const optFromRedis = await redis.get(otpKey(phone))
    console.log("OTP in Redis exists or not: ", optFromRedis);
    
    // Check if otp exists in Redis
    if(!optFromRedis) return res.json({ error: 'OTP expired or does not exist.' })

    // Check if otp is valid with Redis or not
    if(optFromRedis !== otp) return res.json({ error: 'OTP is not valid.' })

    // If Verified then delete the OTP from Redis
    await redis.del(otpKey(phone))
    res.json({ msg: 'OTP verified successfully.' })
})

// For TTL 
app.get('/otp/:phone/ttl', async (req, res) => {
    // We'll provide the key to redis's ttl method to find out the ttl for specific key from Redis dictionary/record
    const checkTTL = await redis.ttl(otpKey(req.params.phone))
    res.json({ ttl: checkTTL })
})

app.listen(4000, () => {
    console.log('Server listening to port: ', 'http://localhost:4000');    
})