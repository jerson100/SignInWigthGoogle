import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    image: String,
    provider: {
      type: String,
      default: "google",
      enum: ["local", "google"],
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default model("User", UserSchema);
