import { readdirSync } from "fs";
import path from "path";
import { subscribe } from "..";
import { prisma } from "../lib/prisma";
import template from "../migrations/template";
import { redis } from "..";

subscribe.psubscribe("mailer:*", (err, count) => {
  if (err) {
    console.error("Failed to subscribe:", err);
  } else {
    console.log(`Subscribed to ${count} pattern(s)`);
  }
});

const rdbTemplates = await redis.duplicate().keys("template:*");
const dbTemplate = await prisma.email.findMany();
const dbRequirements = await prisma.requirement.findMany();
const template_migrate = await template(
  rdbTemplates,
  dbTemplate,
  dbRequirements,
);
if (template_migrate) console.log("[MIGRATION] Template migration completed.");

const eventPath = path.join(__dirname, "../events");
console.log("Loading event handlers from:", eventPath);
readdirSync(eventPath).forEach(async (file) => {
  if (file.endsWith(".ts") || file.endsWith(".js")) {
    console.log(path.join(eventPath, file));
    await import(path.join(eventPath, file));
  }
});
