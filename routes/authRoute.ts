import express from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  const loginSession = req.session as typeof req.session & {
    messages?: string[];
  };

  const failureMessage = loginSession.messages?.[0] ?? "";

  // Consume the message so it does not appear on future visits.
  loginSession.messages = [];

  res.render("login", { failureMessage });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true
    /* FIX ME: Done😭 failureMsg needed when login fails */
  })
);

router.get(
  "/github",
  passport.authenticate("github")
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true,
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
