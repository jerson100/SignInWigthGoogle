import express from "express";
import dotenv from "dotenv";
import UserRouter from "./src/routes/User.router.js";
import AuthRouter from "./src/routes/Auth.router.js";
import connectMongoDb from "./src/lib/mongoDb.js";
import { handleError } from "./src/lib/handleError.js";
import logger from "morgan";
import passport from "passport";
import cors from "cors";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "./src/schemas/User.model.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import ProductRouter from "./src/controllers/Product.controller.js";
// import UserModel from "./src/schemas/User.model.js";

dotenv.config();

const app = express();

connectMongoDb();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (jwtPayload, done) => {
      //   console.log(jwtPayload);
      try {
        const user = await UserModel.findOne({
          email: jwtPayload.user.email,
          status: 1,
        });
        if (!user) {
          return done(new Error("User not found"), false);
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Configurar la estrategia de autenticación de Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Aquí puedes implementar la lógica para encontrar o crear un usuario en tu base de datos
      // Utiliza la información del perfil de Google para autenticar al usuario
      // Luego, llama a 'done' con el usuario o con 'false' si no se puede autenticar
      // Ejemplo:
      //   UserModel.findOne({});
      console.log(profile);
      const existsUser = await UserModel.findOne({
        email: profile.emails[0].value,
        status: 1,
      });
      let us;
      if (existsUser) {
        const updateUs = await UserModel.findByIdAndUpdate(existsUser._id, {
          $set: {
            provider: "google",
            name: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          },
        });
        us = updateUs;
      } else {
        const newUser = new UserModel({
          provider: "google",
          name: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
        });
        us = await newUser.save();
      }
      //   const user = {
      //     id: profile.id,
      //     name: profile.displayName,
      //     email: profile.emails[0].value,
      //   };
      done(null, us.toObject() || false);
    }
  )
);

app.use(logger("dev"));

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/products", ProductRouter);

app.listen(4001, () => {
  console.log("Server is running on port 4001.");
});

app.use(handleError);
