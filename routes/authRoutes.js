// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const AuthS = require("../services/authS.js"); // Importa el servicio de autenticación

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

module.exports = router;
