const express = require("express");
const router = express.Router();
const passport = require("passport");
const AuthS = require("../services/authS.js");
const verifyJWT = require("../middlewares/verifyJWT");

router.post("/login", AuthS.loginLocal);

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
    session: false,
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

router.get("/me", verifyJWT, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
