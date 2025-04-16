// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const AuthS = require("../services/authS.js");

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      return res.status(200).json({
        success: true,
        message: "Login exitoso",
        user: {
          id: user.id,
          email: user.email,
        },
      });
    });
  })(req, res, next);
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", // <- Esto obliga a mostrar la pantalla para elegir cuenta
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.URL_BACKEND}/oauth-popup.html?token=Fail`,
  }),
  AuthS.OAuth
);

router.get(
  "/microsoft",
  passport.authenticate("microsoft", {
    scope: ["user.read"],
    prompt: "select_account",
  })
);

router.get(
  "/microsoft/callback",
  passport.authenticate("microsoft", {
    failureRedirect: `${process.env.URL_BACKEND}/oauth-popup.html?token=Fail`,
  }),
  AuthS.OAuth
);

router.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "No autenticado" });
  }
  res.json(req.user);
});

module.exports = router;
