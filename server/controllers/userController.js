
import Signup from "../models/userModel.js";

export const createUser = async (req, res) => {
  try {
    const { email, username,  clerkUserId } = req.body;

    const existingUser = await Signup.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new Signup({
      email,
      username,
      clerkUserId
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });

  } catch (err) {
    conso+le.error("Error creating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
