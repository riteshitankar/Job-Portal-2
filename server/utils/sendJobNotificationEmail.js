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
        subject: `New job posted for ${job.title} role ...`,
        html: `
  <div style="background-color:#f4f6f8;padding:30px 0;font-family:Arial,Helvetica,sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <tr>
        <td style="background:#2563eb;padding:20px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;">
            New Job Opportunity
          </h1>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:25px;color:#333;">
          <h2 style="margin-top:0;color:#1f2937;">
            ${job.title}
          </h2>

          <p style="margin:8px 0;font-size:15px;">
            📍 <strong>Location:</strong> ${job.jobRequirements.location}
          </p>

          <p style="margin:8px 0 20px;font-size:15px;">
            🗂️ <strong>Category:</strong> ${job.jobRequirements.category}
          </p>

          <div style="text-align:center;margin-top:30px;">
            <a href="${jobLink}" target="_blank"
              style="
                background:#2563eb;
                color:#ffffff;
                text-decoration:none;
                padding:12px 26px;
                font-size:15px;
                border-radius:6px;
                display:inline-block;
                font-weight:bold;
              ">
              View Job Details →
            </a>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#6b7280;">
          You are receiving this email because you registered on our Job Portal.<br/>
          © ${new Date().getFullYear()} Job Portal. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `,
    };


    await transporter.sendMail(mailOptions);
};
