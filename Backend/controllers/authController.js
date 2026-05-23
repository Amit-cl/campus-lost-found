const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const cleanUser = (user) => ({ _id: user._id, name: user.name, email: user.email, role: user.role });

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email is already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ user: cleanUser(user), token: makeToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: "Registration failed.", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password." });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid email or password." });

    res.json({ user: cleanUser(user), token: makeToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};
