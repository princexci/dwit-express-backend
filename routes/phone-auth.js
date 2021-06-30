const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { User, validationSchema } = require("../model/User");
const Auth = require("../model/Auth");
const validateRequest = require("./middlewares/validateRequest");

const verifyToken = require("./middlewares/verifyToken");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check in database whether the user exists with that email and password...
    const user = await User.findOne({ email });

    // my new changes.....

    // If user does not exist
    if (!user) return res.status(400).send("Email / Password does not exist.");

    // We have user now, check password..
    const validPass = await bcrypt.compare(password, user.password); // true | false

    if (!validPass)
      return res.status(400).send("Email / Password does not exist.");

    // Now, the password is correct...
    const payload = {
      id: user._id,
    };

    // Create a token that the user can use....in any platform java, react, react native, python...
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    // Create a token that the user can use....in any platform java, react, react native, python...
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET);

    // Save refresh token in database....
    const savedRefreshToken = await new Auth({ refreshToken }).save();

    if (!savedRefreshToken) res.sendStatus(500);

    res.send({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
  }
});

router.post("/refresh", async (req, res) => {
  // Get token from cookie
  const { refreshToken } = req.body;

  const foundRefreshTokenInDb = await Auth.findOne({ refreshToken });

  if (!foundRefreshTokenInDb) return res.send(401); // Send forbidden..

  // If refresh token exists in db---procced to generate new access token...

  // Check if provided refresh token is valid....
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    const { id } = user;
    const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    res.json({ accessToken });
  });
});

// Get the currently logged in user req.user = {decoded data...}
// $axios.get('/auth/user') -> after login
router.get("/user", verifyToken, async (req, res) => {
  try {
    console.log(req.user);
    const { id } = req.user;
    const user = await User.findById(id);

    // const user = await User.findOne({ _id: ObjectId(id) });
    res.json({
      id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/logout", async (req, res) => {
  try {
    // We have refresh token in cookie
    const { refreshToken } = req.body;

    // If user hasn't sent a refreshtoken from cookie....
    if (!refreshToken) return res.sendStatus(400);

    // Find the sent refresh token and
    await Auth.findOneAndDelete({
      refreshToken,
    });
    res.send(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
