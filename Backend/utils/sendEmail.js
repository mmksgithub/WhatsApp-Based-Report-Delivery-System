import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const sendEmail = async (
  subject,
  send_to,
  sent_from,
  reply_to,
  template,
  name,
  link
) => {
  try {
    // Create Email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Use cautiously in production
      },
    });

    // Configure Handlebars
    const handlebarOptions = {
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve("./views"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./views"),
      extName: ".handlebars",
    };

    transporter.use("compile", hbs(handlebarOptions));

    // Email options
    const options = {
      from: sent_from,
      to: send_to,
      replyTo: reply_to,
      subject,
      template,
      context: { name, link },
    };

    // Send email
    const info = await transporter.sendMail(options);
    console.log("Email sent successfully:", info.response);
    return info; // Return info for further handling if needed
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Propagate the error for higher-level handling
  }
};

export default sendEmail;
