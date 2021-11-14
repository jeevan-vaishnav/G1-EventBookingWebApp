const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[1]; //Berar asdkjfaslk
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  let decodedToekn;

  try {
    decodedToekn = jwt.verify(token, "somesupersecratekey");
  } catch (error) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToekn) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToekn.userId;
  next();
};
