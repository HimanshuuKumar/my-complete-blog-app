import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    // token lena
    const token = req.headers.authorization;

    // agar token nahi hai
    if (!token) {
      return res.status(401).json({
        message: "please login first",
      });
    }

    // token verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // user id req me bhejna
    req.user = decoded;

    // next middleware/controller
    next();
  } catch (error) {
    res.status(401).json({
      message: "invalid token",
    });
  }
};

export default auth;
