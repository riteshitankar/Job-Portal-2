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

export const sendApplicationStatusEmail = async ({
  to,
  userName,
  jobTitle,
  companyName,
  status,
}) => {
  const isAccepted = status === "accepted";

  const subject = isAccepted
    ? `🎉 Congratulations! You are shortlisted for ${jobTitle}`
    : `Application Update for ${jobTitle}`;

  const html = `
  <div style="background:#f4f6f8;padding:30px;font-family:Arial,sans-serif;">
    <table align="center" width="100%" style="max-width:600px;background:#fff;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      
      <tr>
        <td style="background:${isAccepted ? "#16a34a" : "#dc2626"};padding:20px;text-align:center;">
          <h2 style="color:#fff;margin:0;">
            ${isAccepted ? "🎉 Application Accepted" : "❌ Application Update"}
          </h2>
        </td>
      </tr>

      <tr>
        <td style="padding:25px;color:#333;">
          <p>Hi <strong>${userName}</strong>,</p>

          <p>
            Your application for the role of
            <strong>${jobTitle}</strong> at
            <strong>${companyName}</strong>
            has been <strong>${status.toUpperCase()}</strong>.
          </p>

          ${
            isAccepted
              ? `<p style="color:#16a34a;font-weight:bold;font-size:16px">
                   Please contact our HR with these email for interview schedule
                 </p>`
              : `<p style="color:#6b7280;">
                   Thank you for applying. We encourage you to apply for other roles.
                 </p>`
          }

          <p style="margin-top:20px;">Best wishes,<br/>Job Portal Team</p>
        </td>
      </tr>

      <tr>
        <td style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#6b7280;">
          © ${new Date().getFullYear()} Job Portal
        </td>
      </tr>

    </table>
  </div>
  `;

  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to,
    subject,
    html,
  });
};
