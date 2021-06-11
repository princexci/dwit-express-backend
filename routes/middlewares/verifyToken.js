const jwt = require("jsonwebtoken");

// Verify if the user is valid
// The user has sent valid token or not...
// axios.get('http://www.mybackend.com/api/categories', {
//   headers: {
//     Authorization: `Bearer ${token}`
//   }
// })
const verifyToken = (req, res, next) => {
  if (req.headers.authorization) {
    // Token format -> Bearer ${token....}
    const accessToken = req.headers.authorization.split(" ")[1];

    // Decode the access token...
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      // If decoded / verified successfully...
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = verifyToken;
