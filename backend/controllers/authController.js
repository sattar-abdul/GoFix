const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper: generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register new user/provider
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exisitng = await User.findOne({ email });
    if (exisitng)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id, role);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.role);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
