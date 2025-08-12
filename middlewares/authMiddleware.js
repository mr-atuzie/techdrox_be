const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.cookies.token; // Get token from HTTP-only cookie

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required: No token provided",
      code: "NO_TOKEN",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      ignoreExpiration: false,
    });

    if (!decoded.userId || typeof decoded.userId !== "string") {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
        code: "INVALID_PAYLOAD",
      });
    }

    // Attach user ID to request
    req.user = decoded.userId;

    next(); // Move to next middleware/controller
  } catch (error) {
    let message = "Authentication failed";
    let code = "AUTH_ERROR";

    if (error instanceof jwt.JsonWebTokenError) {
      if (error.name === "TokenExpiredError") {
        message = "Session expired, please login again";
        code = "TOKEN_EXPIRED";
      } else {
        message = "Invalid token";
        code = "INVALID_TOKEN";
      }
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(401).json({
      success: false,
      message,
      code,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = { protect };
