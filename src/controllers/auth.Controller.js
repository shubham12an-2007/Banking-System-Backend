const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

/**
 * -  user register controller
 * - /api/auth/register
 */

async function userRegisterController(req, res) {
  try {
    const { email, password, name } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email: email });

    if (isUserAlreadyExists) {
      return res.status(422).json({
        message: "User Already exists with this Email",
        status: "failed",
      });
    }

    const user = await userModel.create({ email, password, name });

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error("Registration Error: ", error);
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
}

/**
 * - User Login Controller
 * -  POST /api/auth/login
 */

async function userLogInController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Email or Password is Inavlid" });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Email or Password is Inavlid" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error: ", error);
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
}

module.exports = { userRegisterController, userLogInController };
