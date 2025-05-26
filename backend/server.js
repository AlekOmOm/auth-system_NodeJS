import express from "express";
const app = express();
import config from "./src/config/index.js";

// Extract configuration
const { server, security, rateLimit, cors, frontend } = config;

// --- middleware ---
/*
 * - express
 * - dotenv
 * - json
 * - cors
 * - session
 * - rate limit
 */

app.use(express.json());

/*
 * cors
 * - set origin to allow multiple frontends (Auth-server frontend + client applications)
 * - set credentials to true
 */
import corsMiddleware from "cors";

// Define allowed origins for CORS
const allowedOrigins = [
   frontend.url, // Auth-server frontend
   ...cors.allowedOrigins, // Client applications from env
];

app.use(
   corsMiddleware({
      origin: function (origin, callback) {
         // Allow requests with no origin (like mobile apps or curl requests)
         if (!origin) return callback(null, true);

         if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
         } else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(new Error("Not allowed by CORS"));
         }
      },
      credentials: cors.credentials,
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
      secret: security.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
         sameSite: "lax", // allow same origin different subdomains
         secure: config.env.isProd, // https only in production
         maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
   })
);

/*
 * rate limit
 * - set window to rate limit window
 * - set limit to rate limit limit
 */
import { rateLimit as expressRateLimit } from "express-rate-limit";
const generalLimiter = expressRateLimit(rateLimit);
app.use(generalLimiter);

// --- custom middleware ---

/** --------- routes ---------
 * @name: routes
 * @description: routes for the api
 * @routes:
 *  - auth routes (user)
 *    - login / register / logout
 *  - account routes (logged-in user)
 *    - get account
 *    - update account
 *    - delete account
 *  - user routes (admin)
 *    - get user
 *    - get users
 *    - create user
 *    - update user
 *    - delete user
 *
 * @endpoints role: user
 *  - POST /api/auth/login
 *  - POST /api/auth/register
 *  - POST /api/auth/logout
 *
 * @endpoints role: logged-in user
 *  - GET /api/account/
 *  - POST /api/account/
 *  - PUT /api/account/
 *  - DELETE /api/account/
 *
 * @endpoints role: admin
 *  - GET /api/users/user
 *  - GET /api/users/users
 *  - POST /api/users/user
 *  - PUT /api/users/user
 *  - DELETE /api/users/user
 */

// --- routes ---

/** * Schema detection middleware - detects client schema from URL/token */
import { detectSchema } from "./src/middleware/schemaDetection.js";
app.use(detectSchema);

/** * clientServer - for host-application to connect to auth-system */
import clientServerRoute from "./src/routes/clientServer.js";
app.use("/api/clientServer", clientServerRoute);

import authRoute from "./src/routes/auth.js";
app.use("/api/auth", authRoute);

import userRoute from "./src/routes/user.js";
app.use("/api/users", userRoute);

/** * owner - for client server owners to manage their applications and users */
import ownerRoute from "./src/routes/owner.js";
app.use("/api/owner", ownerRoute);

// --- error handling ---
import { errorHandler } from "./src/middleware/errorHandler.js";
app.use(errorHandler);

app.listen(server.port, server.host, () => {
   console.info(`🚀 Server running on ${server.host}:${server.port} (${server.env})`);
   if (config.env.isDev) {
      console.info(`📱 Frontend: ${frontend.url}`);
      console.info(`🔗 API: http://${server.host}:${server.port}/api`);
   }
});

// Export app for testing
export default app;
