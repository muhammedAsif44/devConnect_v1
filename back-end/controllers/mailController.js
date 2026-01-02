const { sendEmail } = require("../services/emailService");

const sendMailController = async (req, res) => {
  try {
    const { email, type, data } = req.body;

    if (!email || !type) {
      return res.status(400).json({ message: "Email and type are required" });
    }

    let subject, html, text;

    switch (type) {
      case "OTP":
        subject = "Your DevConnect OTP Code";
        text = `Your OTP code is ${data.otp}`;
        html = `<p>Your OTP is: <b>${data.otp}</b></p>`;
        break;

      case "RESET_PASSWORD":
        subject = "Reset Your DevConnect Password";
        text = `Click here to reset your password: ${data.resetLink}`;
        html = `<p>Click <a href="${data.resetLink}">here</a> to reset your password.</p>`;
        break;

      case "WELCOME":
        subject = "Welcome to DevConnect!";
        text = `Welcome ${data.name}! Thanks for joining DevConnect.`;
        html = `<h2>Welcome, ${data.name} 🎉</h2><p>We’re thrilled to have you on board.</p>`;
        break;

      case "SESSION_BOOKED_MENTEE":
        subject = "Session Booked Successfully!";
        text = `Your session with ${data.mentorName} on ${data.date} at ${data.slot} has been booked successfully.`;
        html = `
          <h2>Session Booked Successfully!</h2>
          <p>Hi ${data.menteeName},</p>
          <p>Your session with <strong>${data.mentorName}</strong> has been booked successfully.</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.slot}</p>
          <p><strong>Session Type:</strong> ${data.sessionType}</p>
          <p>We hope you have a great session!</p>
        `;
        break;

      case "SESSION_BOOKED_MENTOR":
        subject = "New Session Request!";
        text = `You have a new session request from ${data.menteeName} on ${data.date} at ${data.slot}.`;
        html = `
          <h2>New Session Request!</h2>
          <p>Hi ${data.mentorName},</p>
          <p>You have received a new session request from <strong>${data.menteeName}</strong>.</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.slot}</p>
          <p><strong>Session Type:</strong> ${data.sessionType}</p>
          <p>Please prepare for the session.</p>
        `;
        break;

      default:
        return res.status(400).json({ message: "Invalid mail type" });
    }

    await sendEmail({ to: email, subject, text, html });

    res.status(200).json({ message: `Mail sent successfully to ${email}` });
  } catch (error) {
    console.error("Error sending mail:", error);
    res.status(500).json({ message: "Mail sending failed", error: error.message });
  }
};

module.exports = { sendMailController };