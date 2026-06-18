import dotenv from "dotenv";
dotenv.config();

import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import client from "prom-client";

import connectDB from "./config/db.js";
import { PORT } from "./config/utils.js";
import authRouter from "./routes/auth.js";
import postsRouter from "./routes/posts.js";

const app = express();
const port = PORT || 5000;

//
// ========================
// 🔥 PROMETHEUS SETUP
// ========================
//
client.collectDefaultMetrics();

// Counter for HTTP requests
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
});

// Middleware (exclude /metrics itself)
app.use((req, res, next) => {
  if (req.path !== "/metrics") {
    httpRequestCounter.inc();
  }
  next();
});

//
// ========================
// 📊 METRICS ENDPOINT
// ========================
//
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

//
// ========================
// ⚙️ MIDDLEWARE
// ========================
//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(compression());

//
// ========================
// 🗄️ DATABASE
// ========================
//
connectDB();

//
// ========================
// 🛣️ ROUTES
// ========================
//
app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Yay!! Backend of wanderlust prod app is now accessible");
});

//
// ========================
// 🚀 START SERVER
// ========================
//
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;