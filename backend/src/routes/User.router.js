import { Router } from "express";
import UserController from "../controllers/User.controller.js";
import { handleControllerError } from "../lib/handleError.js";

const UserRouter = Router();

UserRouter.route("/")
  .post(handleControllerError(UserController.create))
  .get(handleControllerError(UserController.getAll));

export default UserRouter;
