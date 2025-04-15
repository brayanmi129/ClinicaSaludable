const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const Auth = require("../model/authM.js");
const UsersM = require("../model/userM.js");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.URL_BACKEND}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await Auth.OAuth(profile);
        return done(null, user);
      } catch (error) {
        console.error("Error en GoogleStrategy:", error);
        done(error);
      }
    }
  )
);

passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: `${process.env.URL_BACKEND}/auth/microsoft/callback`,
      scope: ["user.read"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await Auth.OAuth(profile); // Similar a tu AuthGoogle
        return done(null, user);
      } catch (error) {
        console.error("Error en MicrosoftStrategy:", error);
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await UsersM.getByEmail(email); // Esperamos la promesa
    console.log("Usuario deserializado:", user);
    done(null, user); // Ya con el usuario real
  } catch (err) {
    console.error("Error deserializando usuario", err);
    done(err, null);
  }
});
