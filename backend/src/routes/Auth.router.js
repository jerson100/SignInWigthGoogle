import { Router } from "express";
import passport from "passport";
import { generateAccessToken } from "../lib/token.js";
import { handleControllerError } from "../lib/handleError.js";
import UserController from "../controllers/User.controller.js";

const router = Router();

//redirecting to frontend to google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

//cuando ya nos elegimos una cuenta, google nos redirige a esta ruta
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failedLogin",
    session: false,
  }),
  function (req, res) {
    const newAccessToken = generateAccessToken({
      user: {
        email: req.user.email,
        _id: req.user._id,
        image: req.user.image,
        name: req.user.name,
      },
    });
    res.cookie("appauth-accessToken", newAccessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 1,
      httpOnly: false, //solo se puede acceder através de solicitudes http y no desde javascript del navegador
      //   secure: false, //true en produccion enviado atravez de hhtps
      //   sameSite: "none", //cookie solo enviada en request del mismo dominio
    });
    res.redirect(`http://localhost:5173/`);
  }
);

router.get("/verify", handleControllerError(UserController.verifyUser));

export default router;
