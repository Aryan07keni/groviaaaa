const express = require("express");
const passport = require("passport");
const router = express.Router();

// Step 1: Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google redirects back here
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login-failed" }),
  (req, res) => {
    // Success — redirect to explore page
    res.redirect("http://127.0.0.1:5500/Frontend/explore.html");
  }
);

// Get current logged-in user (called by frontend)
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(`${process.env.FRONTEND_URL}/Frontend/login.html`);
  });
});

router.get("/login-failed", (req, res) => {
  res.status(401).json({ error: "Google login failed" });
});

module.exports = router;