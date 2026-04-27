import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  if (!user.password) {
  return res.status(400).json({
    msg: "This account was created using Google. Please login with Google.",
  });
}

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});

  res.json({
  token,
  user: {
    id: user._id,
    email: user.email,
  },
});
};
//for new user to register
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    //  create token here also
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

//google authorization
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture , sub} = payload;

    // Check user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
       googleId: sub,
      });
    }

    //  Create YOUR JWT (same as login)
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: jwtToken,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Google authentication failed" });
  }
};