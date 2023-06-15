import { HttpError } from "../lib/httpError.js";
import { generateAccessToken } from "../lib/token.js";
import UserModel from "../schemas/User.model.js";
import bcrypt from "bcrypt";
const { hashSync } = bcrypt;

const create = async ({ name, email, password }) => {
  const existUser = await UserModel.findOne({
    email,
  });
  if (existUser) throw new HttpError(400, "User already exists");
  const hashedPassword = hashSync(password, 10);
  const user = new UserModel({
    name,
    email,
    password: hashedPassword,
  });
  await user.save();
  const { password: p, ...restUs } = user.toObject();
  return restUs;
};

const findAll = async () => {
  const users = await UserModel.find(
    {
      status: 1,
    },
    {
      password: 0,
    }
  );
  return users;
};

const verifyUser = async (id) => {
  const us = await UserModel.findOne(
    {
      _id: id,
      status: 1,
    },
    {
      password: 0,
    }
  );
  console.log(id, us);
  if (!us) throw new HttpError(404, "User not found");
  return {
    user: us,
    accessToken: generateAccessToken({
      user: {
        email: us.email,
        _id: us._id,
        image: us.image,
        name: us.name,
      },
    }),
  };
};

export default { create, findAll, verifyUser };
