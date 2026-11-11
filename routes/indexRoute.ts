import express from "express";
const router = express.Router();
import { ensureAuthenticated, ensureIsAdmin } from "../middleware/checkAuth";
import type { AdminSessionRow } from "../interfaces";

router.get("/", (req, res) => {
  res.send(
    "<pre><strong>http://localhost:8000/auth/login</strong> for the login page. </pre><pre><strong>http://localhost:8000/dashboard</strong> for the dashboard (requires login).</pre>",
  );
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/admin", ensureIsAdmin, (req, res) => {
  req.sessionStore.all!((err, sessions) => {
    if (err) {
      return res.status(500).send("Could not load sessions");
    }

    const storedSessions = (sessions ?? {}) as 
    Record< string, { passport?: { user: number } } >;

    const activeSessions: AdminSessionRow[] = [];

    for (const sessionId in storedSessions) {
      const userId = storedSessions[sessionId]?.passport?.user;

      if (userId !== undefined) {
        activeSessions.push({ sessionId, userId });
      }
    }

    res.render("admin", {
      user: req.user,
      sessions: activeSessions,
    });
  });
});

router.post( "/admin/sessions/:sessionId/revoke",ensureIsAdmin, (req, res) => {
    const sessionId = req.params.sessionId;

    req.sessionStore.destroy(sessionId, (err) => {
      if (err) {
        return res.status(500).send("Could not revoke session");
      }

      res.redirect("/admin");
    });
  }
);

export default router;
