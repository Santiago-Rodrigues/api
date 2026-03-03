import User from "../models/User.js";
import crypto from "node:crypto";
import cryptPassword from 'bcrypt'

export const createUser = async (req, res) => {
  try {
    const userData = req.body

    const salt = await cryptPassword.genSalt()

    const userToCreate = {
      id: crypto.randomUUID(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
    };
    const user = await User.create(userToCreate);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.status(200).json(users);
};

export const deleteUser = async (req, res) => {

    const user = await User.destroy({
        where: {id: req.params.id}
    })
  res.status(200).json({ message: "Deu bom" });
};
