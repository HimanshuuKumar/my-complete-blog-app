import { User } from "../Models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

//sign up

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const Repeated = await User.findOne({ email });
    if (Repeated)
      return res.json({
        message: "user is already registered, please do login.",
      });
    //hashpassword
    const hashPass = await bcrypt.hash(password, 10);
    //image upload on cloudinary
    let imageUrl = "";
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "mern_blog_profiles",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }
    const newUser = await User.create({
      name,
      email,
      password: hashPass,
      profilePic: imageUrl,
    });
    res.json({ message: "user registered successfully", newUser });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const Repeated = await User.findOne({ email });

    if (!Repeated) {
      return res.status(400).json({
        message: "User is not registered, please signup.",
      });
    }

    const correctPass = await bcrypt.compare(password, Repeated.password);

    if (!correctPass) {
      return res.status(400).json({
        message: "Please enter correct password",
      });
    }

    const token = jwt.sign({ id: Repeated._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login success",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//profile

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};
