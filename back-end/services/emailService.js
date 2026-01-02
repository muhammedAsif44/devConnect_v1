const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

// Create transporter once
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Generic email sender
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: `"DevConnect" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Send Email Error:", err);
    throw new Error("Email could not be sent");
  }
};

// OTP generator + sender
const sendOTP = async (user, type = "signup", expiryMinutes = 10) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = await bcrypt.hash(otp, 10);

  user.otp = {
    code: hashedOTP,
    type,
    expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000),
  };
  await user.save();

  const subject = type === "signup" ? "Signup Verification OTP" : "Password Reset OTP";
  const text =
    type === "signup"
      ? `Your OTP for account verification is ${otp}. It expires in ${expiryMinutes} minutes.`
      : `Your OTP for password reset is ${otp}. It expires in ${expiryMinutes} minutes.`;

  await sendEmail({ to: user.email, subject, text });
  return otp;
};

// Admin notification for new pending mentor
const sendAdminNotification = async (user) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL; // store in .env
    const subject = `New Mentor Pending Approval - ${user.name}`;
    const html = `
      <h3>New Mentor Signup Pending Approval</h3>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Experience:</strong> ${user.mentorProfile?.experience || "N/A"}</p>
      <p>Click below to approve:</p>
      <a href="${process.env.CLIENT_URL}/admin/verify-mentor/${user._id}" style="padding:10px 15px;background:#28a745;color:#fff;text-decoration:none;">Approve Mentor</a>
    `;
    await sendEmail({ to: adminEmail, subject, html });
  } catch (err) {
    console.error("Error sending admin notification:", err);
  }
};

// Session booking notification for mentee
const sendSessionBookedMenteeNotification = async (mentee, mentor, session) => {
  try {
    const subject = "Session Booked Successfully!";
    const html = `
      <h2>Session Booked Successfully!</h2>
      <p>Hi ${mentee.name},</p>
      <p>Your session with <strong>${mentor.name}</strong> has been booked successfully.</p>
      <p><strong>Date:</strong> ${session.date}</p>
      <p><strong>Time:</strong> ${session.slot}</p>
      <p><strong>Session Type:</strong> ${session.sessionType}</p>
      <p>We hope you have a great session!</p>
    `;
    const text = `Your session with ${mentor.name} on ${session.date} at ${session.slot} has been booked successfully.`;
    
    await sendEmail({ to: mentee.email, subject, text, html });
  } catch (err) {
    console.error("Error sending mentee session notification:", err);
  }
};

// Session booking notification for mentor
const sendSessionBookedMentorNotification = async (mentee, mentor, session) => {
  try {
    const subject = "New Session Request!";
    const html = `
      <h2>New Session Request!</h2>
      <p>Hi ${mentor.name},</p>
      <p>You have received a new session request from <strong>${mentee.name}</strong>.</p>
      <p><strong>Date:</strong> ${session.date}</p>
      <p><strong>Time:</strong> ${session.slot}</p>
      <p><strong>Session Type:</strong> ${session.sessionType}</p>
      <p>Please prepare for the session.</p>
    `;
    const text = `You have a new session request from ${mentee.name} on ${session.date} at ${session.slot}.`;
    
    await sendEmail({ to: mentor.email, subject, text, html });
  } catch (err) {
    console.error("Error sending mentor session notification:", err);
  }
};

module.exports = { 
  sendEmail, 
  sendOTP, 
  sendAdminNotification,
  sendSessionBookedMenteeNotification,
  sendSessionBookedMentorNotification
};