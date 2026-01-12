import { subscribe } from "../index";

subscribe.on("pmessage", async (pattern, channel, message) => {
  console.log(`Received message on channel ${channel.split(":")[1]}: ${message}`);
});

subscribe.on("error", (err) => {
  console.error("Subscriber error:", err);
});