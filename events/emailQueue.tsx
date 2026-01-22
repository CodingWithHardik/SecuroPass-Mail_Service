import "dotenv/config";
import { redis } from "..";
import { mail_transporter } from "../lib/nodemailer";
import { render } from "@react-email/components";
import path from "path";
import fs from "fs";

const EMAIL_LIMIT_TYPE = process.env.EMAIL_LIMIT_TYPE;
const EMAIL_LIMIT = Number(process.env.EMAIL_LIMIT || 0);
let WINDOW_SECOND = 0;
if (EMAIL_LIMIT_TYPE === "MINUTE") WINDOW_SECOND = 60;
if (EMAIL_LIMIT_TYPE === "HOUR") WINDOW_SECOND = 3600;
if (EMAIL_LIMIT_TYPE === "DAY") WINDOW_SECOND = 86400;

async function email_queue() {
  const now = Date.now();
  const expiresIn = now + WINDOW_SECOND * 1000;
  await redis.zremrangebyscore("limit:count", 0, now);
  let limit = Number((await redis.zcard("limit:count")) || "0");
  if (limit === null) return email_queue();
  if (limit >= EMAIL_LIMIT) {
    const list = await redis.zrange("limit:count", 0, 0, "WITHSCORES");
    if (list.length > 1) {
      const oldest = Number(list[1]);
      const waitTime = Math.max(oldest - now, 50);
      await new Promise((r) => setTimeout(r, waitTime));
    } else {
      await new Promise((r) => setTimeout(r, 1000));
    }
    return email_queue();
  }
  const popdata = await redis.brpop("email_queue", 0);
  const emailData = JSON.parse(popdata![1]);
  await redis.zadd("limit:count", expiresIn, now.toString());
  const templatePathTs = path.join(
    __dirname,
    "../templates",
    emailData.brand,
    "mail",
    emailData.template + ".tsx",
  );
  const templatePathJs = path.join(
    __dirname,
    "../templates",
    emailData.brand,
    "mail",
    emailData.template + ".jsx",
  );
  if (!fs.existsSync(templatePathTs) && !fs.existsSync(templatePathJs)) return;
  const templateModule = fs.existsSync(templatePathTs)
    ? await import(templatePathTs)
    : await import(templatePathJs);
  if (!templateModule || !templateModule.default) return;
  const Content = templateModule.default;
  const renderedOutput = await render(<Content {...emailData.data} />);
  const info = await mail_transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
    to: emailData.to,
    subject: templateModule.subject || "No Subject",
    html: renderedOutput,
    envelope: {
      from: "support@securopass.com",
      to: emailData.to,
    },
    headers: {
      "Importance": "high",
    }
  });
  console.log("Envelope used:", info.envelope);
  const lengthData = await redis.llen("email_queue");
  if (
    EMAIL_LIMIT_TYPE === "MINUTE" &&
    lengthData > 0 &&
    isFinite((60 / EMAIL_LIMIT) * 1000)
  )
    await new Promise((r) => setTimeout(r, (60 / EMAIL_LIMIT) * 1000));
  return email_queue();
}
email_queue();
