require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

require("./auth/google"); // load passport strategy

const authRoutes = require("./route/googleAuth");

const app = express();

// ✅ CORS — allow your frontend origin
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    credentials: true,
  })
);

// ✅ Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session middleware (must be before passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "grovia_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
    },
  })
);

// ✅ Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// ✅ Auth routes (Google OAuth)
app.use("/auth", authRoutes);

// ✅ Test route — open http://localhost:5000 to confirm server is running
app.get("/", (req, res) => {
  res.send("✅ Grovia backend is running!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});