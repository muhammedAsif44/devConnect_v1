// Load environment variables first thing
require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

// =======================
// 🔥 Import Routes
// =======================
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const postRoutes = require("./routes/postsRoutes");
const userRoutes = require("./routes/userRoutes");
const followRoutes = require("./routes/followRoutes");
const friendRequestRoutes = require("./routes/friendRequestRoutes");
const skillRoutes = require("./routes/skillRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const chatRoutes = require("./routes/chatRoutes");
const mailRoutes = require("./routes/mailRoutes"); // Add mail routes

// =======================
// 🔧 Express Setup
// =======================
const app = express();
const server = http.createServer(app); // Required for Socket.IO
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL || "http://localhost:5173"],
 
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// =======================
// ⚙️ Register Routes
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/post", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/friend-requests", friendRequestRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/premium", premiumRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/mail", mailRoutes); // Add mail routes

// =======================
// ✅ Ping Test
// =======================
app.get("/ping", (req, res) => res.json({ message: "pong" }));

// =======================
// 🔥 Socket Setup
// =======================
const chatSocket = require("./socket/chatSocket");
chatSocket(io); // initialize chat socket logic

// =======================
// 🚀 Start Server
// =======================
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });