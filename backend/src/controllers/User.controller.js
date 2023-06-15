import UserService from "../services/User.service.js";

const create = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await UserService.create({ name, email, password });
  res.status(201).json(user);
};

const getAll = async (req, res) => {
  const users = await UserService.findAll();
  return res.status(200).json(users);
};

const verifyUser = async (req, res) => {
  const { id } = req.query;
  const { user, accessToken } = await UserService.verifyUser(id);
  res.cookie("appauth-accessToken", accessToken);
  res.status(200).json(user);
};

export default { create, getAll, verifyUser };
