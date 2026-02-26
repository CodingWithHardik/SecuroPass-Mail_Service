import { readdirSync } from "fs";
import path from "path";
import { subscribe } from "..";
import { prisma } from "../lib/prisma";
import template from "../migrations/template";
import { redis } from "..";
import { mail_transporter } from "../lib/nodemailer";

subscribe.psubscribe("mailer:*", (err, count) => {
  if (err) {
    console.error("Failed to subscribe:", err);
  } else {
    console.log(`Subscribed to ${count} pattern(s)`);
  }
});

const rdbTemplates = await redis.duplicate().keys("template:*");
const dbTemplate = await prisma.template.findMany();
const dbRequirements = await prisma.requirement.findMany();
const template_migrate = await template(
  rdbTemplates,
  dbTemplate,
  dbRequirements,
);
if (template_migrate) console.log("[MIGRATION] Template migration completed.");

const eventPath = path.join(__dirname, "../events");
readdirSync(eventPath).forEach(async (file) => {
  if (file.endsWith(".ts") || file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".tsx")) {
    await import(path.join(eventPath, file));
  }
});

mail_transporter.verify().then(() => {
  console.log("Mail transporter is ready to send emails");
}).catch((err) => {
  console.error("Mail transporter verification failed:", err);
});