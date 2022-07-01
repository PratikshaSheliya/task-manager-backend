var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
exports.token = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.userData = decoded;
    next();
  } catch (err) {
    res.status(401).send({
      msg: "Auth failed",
    });
  }
};
