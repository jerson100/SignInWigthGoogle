import { Router } from "express";
import { handleControllerError } from "../lib/handleError.js";
import passport from "passport";
import { HttpError } from "../lib/httpError.js";
// import authorized from "../lib/authorized.js";

const ProductRouter = Router();

const authenticateMiddleware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err); // Pasar el error al siguiente middleware de manejo de errores
    }
    if (!user) {
      return next(new HttpError(401, "User unauthorized")); // Generar un nuevo UnauthorizedError
    }
    // El usuario está autenticado, se puede continuar con el siguiente middleware
    req.user = user;
    next();
  })(req, res, next);
};

// const requireAuth = passport.authenticate("jwt", { session: false });

ProductRouter.get(
  "/",
  //   requireAuth,
  authenticateMiddleware,
  handleControllerError((req, res) => {
    res.json([
      {
        id: 1,
        name: "Producto 1",
        price: 100,
        image: "https://picsum.photos/200/300",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
      },
      {
        id: 2,
        name: "Producto 2",
        price: 200,
        image: "https://picsum.photos/200/300",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
      },
      {
        id: 3,
        name: "Producto 3",
        price: 300,
        image: "https://picsum.photos/200/300",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
      },
      {
        id: 4,
        name: "Producto 4",
        price: 400,
        image: "https://picsum.photos/200/300",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
      },
      {
        id: 5,
        name: "Producto 5",
        price: 500,
        image: "https://picsum.photos/200/300",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
      },
      {
        id: 6,
        name: "Producto 6",
        price: 600,
        image: "https://picsum.photos/200/300",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
      },
    ]);
  })
);

export default ProductRouter;
