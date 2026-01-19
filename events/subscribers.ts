import { subscribe } from "../index";
import { requirementCheck } from "../utils/requirementCheck";
import path from "path";
import fs from "fs";
import { redis } from "..";

subscribe.on("pmessage", async (pattern, channel, message) => {
  const redisClient = redis.duplicate()
  const msg = JSON.parse(message)
  if (!msg.to) return;
  const channelParts = channel.split(":");
  const templateget = await redisClient.get(`template:${channelParts[2]}`);
  if (!templateget) return;
  const templatedata = JSON.parse(templateget!)
  const isValid = requirementCheck(msg, templatedata);
  if (!isValid) return;
  const { to, ...msgdata } = msg;
  redisClient.lpush("email_queue", JSON.stringify({
    to: to,
    brand: channelParts[1] as string,
    template: templatedata.templateLocation,
    data: msgdata,
  }));

  console.log(JSON.parse(templateget!));
});

subscribe.on("error", (err) => {
  console.log(err)
});
