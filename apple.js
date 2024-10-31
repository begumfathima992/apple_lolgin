import express from "express";
import session from "express-session";
import crypto from "crypto";
import cors from "cors";
import jwt from "jsonwebtoken";

// Generate a strong session secret
const secret = crypto.randomBytes(64).toString("hex");

const app = express();

// Enable CORS and specify allowed origins
app.use(
  cors({
    origin: "http://192.168.29.199:3000", // Allow requests from your frontend
    credentials: true,
  })
);

// AWS Cognito Hosted UI details
const cognitoDomain = ""; // Your Cognito domain
const clientId = ""; // Cognito App Client ID
const callbackUrl = "com.notion://auth"; // Change for local server testing
// const callbackUrl = "https://jwt.io/";
// Middleware for sessions
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    },
  })
);
app.get("/auth/apple", (req, res) => {
  console.log("Request received at /auth/apple endpoint");
  // Use "token" as the response_type for Implicit Grant Type
  const loginUrl = `https://${cognitoDomain}/login?response_type=token&client_id=${clientId}&redirect_uri=${callbackUrl}&identity_provider=Apple`;
  console.log("Redirecting to Cognito URL for Apple Sign-In: ", loginUrl);
  res.redirect(loginUrl);
});

// Start Express server
app.listen(3000, () => {
  console.log("Server is running on http://192.168.29.199:3000");
});
