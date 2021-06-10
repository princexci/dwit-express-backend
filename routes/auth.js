// Login -> sends back the user a token signed with the user data itself

// Create a middleware that verifies the JWT token...if verified proceeds,
// else...rejects the API call...

// Authenticate different routes using this (verifyToken) middleware

const router = require("express").Router();
const jwt = require("jsonwebtoken");

const verifyToken = require("./middlewares/verifyToken");

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Check in database whether the user exists with that email and password...
  if (email === "bob@gmail.com" && password === "test11") {
    // Get that user - database mock
    const user = {
      name: "Bob",
      address: "Nepal",
      contact: "9842323212",
      email: "bob@gmail.com",
    };
    // Create a token that the user can use....in any platform java, react, react native, python...
    const accessToken = jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "10s",
    });
    // Create a token that the user can use....in any platform java, react, react native, python...
    const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET);

    res.send({ accessToken, refreshToken });
  } else {
    // User does not exist...
    res.send("You do not exist");
  }
});

router.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;

  // Check if provided refresh token is valid....
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    const { name, address, contact, email } = user;
    const accessToken = jwt.sign(
      { name, address, contact, email },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "10s",
      }
    );
    res.json({ accessToken });
  });
});

// Get the currently logged in user
router.get("/user", verifyToken, (req, res) => {
  res.send(req.user);
});

module.exports = router;
