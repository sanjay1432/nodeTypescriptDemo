import nodemailer from "nodemailer";
import logger from "../utils/logger";
import ENV from "../utils/env";
// Configuración transportador NodeMailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: ENV.APP_MAIL_USER, pass: ENV.APP_MAIL_PWD }
});
export async function sendVerificationMail(data) {
  const email = {
    from: ENV.APP_MAIL_USER,
    to: data.email,
    subject: "EMail Verification",
    html: `<b><a href ="${data.url}">${data.url} </a></b>` // html body
  };
  await transporter.sendMail(email).catch(error => {
    logger.error(error);
  });
}
