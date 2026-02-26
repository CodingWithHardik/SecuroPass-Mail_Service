import { createTransport } from "nodemailer";
export const mail_transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === "true",
    pool: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
})

mail_transporter.verify().then(() => {
    console.log("Mail transporter is ready to send messages");
}).catch((err) => {
    console.error("Error with mail transporter:", err);
});

