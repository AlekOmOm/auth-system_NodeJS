import express from "express";
const app = express();

// --- environment variables ---
const PORT = process.env.BACKEND_PORT || 3001;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;
const RATE_LIMIT_WINDOW = process.env.RATE_LIMIT_WINDOW || 15;
const RATE_LIMIT_LIMIT = process.env.RATE_LIMIT_LIMIT || 300;

// --- middleware ---
/*
 * - express
 * - dotenv
 * - json
 * - cors
 * - session
 * - rate limit
 */

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

app.use(express.json());

/*
 * cors
 * - set origin to frontend port
 * - set credentials to true
 */
import cors from "cors";
app.use(
  cors({
    origin: `http://localhost:${FRONTEND_PORT}` || "http://localhost:3000",
    credentials: true,
  })
);

/*
 * session
 * - set secret to session secret
 * - set resave to false
 * - set saveUninitialized to false
 */
import session from "express-session";
app.use(
  session({
    secret: "" + SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // https only (true in production)
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

/*
 * rate limit
 * - set window to rate limit window
 * - set limit to rate limit limit
 */
import { rateLimit } from "express-rate-limit";
const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW * 60 * 1000, // 15 minutes
  limit: RATE_LIMIT_LIMIT, // 300 requests per window
  standardHeaders: "draft-8", // RateLimit headers
  legacyHeaders: false, // X-RateLimit headers
});
app.use(generalLimiter);

// --- custom middleware ---

/*
 * auth routes
 * - login / register / logout
 *
 * endpoints (fx. localhost:3001/api/auth/...):
 *  - POST /api/auth/login
 *  - POST /api/auth/register
 *  - POST /api/auth/logout
 */
import authRoutes from "./src/routes/auth.js";
app.use("/api/auth", authRoutes);

import userRoutes from "./src/routes/user.js";
app.use("/api/users", userRoutes);

// --- server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
