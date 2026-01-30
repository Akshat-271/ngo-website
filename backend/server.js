require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

connectDB();

app.use(cors());

app.use(express.json());

// Routes
app.use("/auth", require("./routes/auth"));


const announcementRoutes = require("./routes/announcementRoutes");
app.use("/api/announcements", announcementRoutes);

app.use("/api/donations", require("./routes/donationRoutes"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);


