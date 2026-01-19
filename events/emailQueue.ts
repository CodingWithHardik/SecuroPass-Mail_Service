import "dotenv/config";
import {redis} from "..";

const MODE = process.env.EMAIL_LIMIT_TYPE || "MINUTE"
const LIMIT = Number(process.env.EMAIL_LIMIT || 20)

let WINDOW_SECOND = 60;
if (MODE === "HOUR") WINDOW_SECOND = 3600;
if (MODE === "DAY") WINDOW_SECOND = 86400;

const CALC_DELAY = WINDOW_SECOND / LIMIT;
const DELAY_SEC  = Math.min(CALC_DELAY, 10);
const DELAY_MS = DELAY_SEC * 1000;
let count = 0
async function email_queue() {
    console.log("Email Queue Processor Started");
    const now = Date.now();
    let windowStart = await redis.get("limit:window:start");
    let count = Number(await redis.get("limit:window:count") || "0");
    if (!windowStart) {
        await redis.set("limit:window:start", now, 'EX', WINDOW_SECOND);
        await redis.set("limit:window:count", "0", 'EX', WINDOW_SECOND);
        windowStart = now.toString();
        count = 0;
    }
    if (count >= LIMIT) {
        const ttl = await redis.ttl("limit:window:start");
        await new Promise(resolve => setTimeout(resolve, ttl * 1000));
        return email_queue();
    }
    const popdata = await redis.brpop("email_queue", 0)
    if (!popdata) email_queue();
    const emailData = JSON.parse(popdata![1]);
    try {
        await redis.incr("limit:window:count")
        console.log(count++)
    } catch (error) {
        console.error("Error in email queue processing:", error);
    }
    await new Promise(r => setTimeout(r, DELAY_MS))
    return email_queue();
}
email_queue();