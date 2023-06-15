import passport from "passport";
import { HttpError } from "./httpError.js";

function authorized() {
  return (req, res) => {
    passport.authenticate(
      "jwt",
      { session: false },
      async (error, token, ...rest) => {
        if (error || !token) {
          //   response.status(401).json({ message: "Unauthorized" });
          new HttpError(401, "The user is not authorized");
        }
        console.log(rest);
        // try {
        //   const user = await User.findOne({
        //     where: { id: token.id },
        //   });
        //   request.user = user;
        // } catch (error) {
        //   next(error);
        // }
      }
    );
  };
}

export default authorized;
