const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smart_mess_system";

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// DB connect
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo connection error:", err.message));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Smart Mess API running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/ngo", require("./routes/ngoRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error" });
});

const server = app.listen(PORT, () => {
  console.log(`Smart Mess backend listening on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the existing server or change PORT.`);
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});
