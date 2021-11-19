const jwt = require("jsonwebtoken");
const JWT_SECRET = "hellothereuser";

const fetchUser = async (req, res, next) => {
  const token = req.headers["auth-token"];
  if (!token) {
    res
      .status(401)
      .send({ error: "Please Authenticate with valid auth-token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res
      .status(401)
      .send({ error: "Please Authenticate with valid auth-token" });
  }
};

module.exports = fetchUser;
