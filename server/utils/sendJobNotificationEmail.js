import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASSWORD,
  },
});

export const sendJobNotificationEmail = async (emails, job) => {
  if (!emails || !emails.length) return;

  const jobLink = `http://localhost:5173/job/${job._id}`;

  const mailOptions = {
    from: process.env.USER_EMAIL,
    bcc: emails, 
    subject: `New Job Posted: ${job.title}`,
    html: `
      <h2>New Job Opportunity</h2>
      <p><strong>${job.title}</strong></p>
      <p>Location: ${job.jobRequirements.location}</p>
      <p>Category: ${job.jobRequirements.category}</p>
      <p>
        <a href="${jobLink}" target="_blank">
          View Job Details
        </a>
      </p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
