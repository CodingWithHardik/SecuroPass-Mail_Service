import { readdirSync } from "fs";
import path from "path";
import { redis, subscribe } from "..";
import { prisma } from "../lib/prisma";
import template from "../migrations/template";

const eventPath = path.join(__dirname, "../events");
readdirSync(eventPath).forEach(async (file) => {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
        await import(path.join(eventPath, file));
    }
});

subscribe.psubscribe("mailer:*", (err, count) => {
  if (err) {
    console.error("Failed to subscribe:", err);
  } else {
    console.log(`Subscribed to ${count} pattern(s)`);
  }
});

const rdbTemplates = await redis.keys("template:*");
const dbTemplate = await prisma.email.findMany()
const template_migrate = await template(rdbTemplates, dbTemplate);
if (template_migrate) console.log("[MIGRATION] Template migration completed.");