// Login -> sends back the user a token signed with the user data itself

// Create a middleware that verifies the JWT token...if verified proceeds,
// else...rejects the API call...

// Authenticate different routes using this (verifyToken) middleware

// Registration implement - done
// Login -> implement with real user data.. - done
// JWT -> handle refresh token with cookies.... - done
// React -> implement auth (login, register)

const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { User, validationSchema } = require("../model/User");
const Auth = require("../model/Auth"); // store refreshTokens....
const validateRequest = require("./middlewares/validateRequest");

const verifyToken = require("./middlewares/verifyToken");

// const ObjectId = mongoose.Types.ObjectId;

// Register a new user
router.post(
  "/register",
  validateRequest(validationSchema),
  async (req, res) => {
    // At this point, we have all the data we need.
    try {
      // Get registration data from body
      const { name, email, mobile, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        return res
          .status(400)
          .send("Password & Confirm Password does not match");
      }

      // Check if user exists...
      const userExist = await User.findOne({ email });

      if (userExist)
        return res.status(409).send("User with this email already exists.");

      // Hash password
      // Salt test11 -> hash $#%ADSFASF#@R@ASDFAS$@ -> real hashed pw + #$%@#$%@#$%SDFVSDSRFSDRFSDR -> salt - random unique string
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create the user
      const newUser = new User({
        name,
        email,
        mobile,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();

      // Send back new user's id.
      res.json({ user: savedUser._id });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check in database whether the user exists with that email and password...
    const user = await User.findOne({ email });

    // If user does not exist
    if (!user) return res.status(404).send("Email / Password does not exist.");

    // At this point we have,
    // user = {
    //   name: 'adsfasdf',
    //   password: "#SDAFSDF #$@AS DF",
    //   email: 'user@gm.com',
    //   date: 322323,
    //   _id: 'asdfsadf'
    // }

    // We have user now, check password..
    const validPass = await bcrypt.compare(password, user.password); // true | false

    if (!validPass)
      return res.status(404).send("Email / Password does not exist.");

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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Cannot be accessed from JS, eliminates the risk of csrf and xss attacks....
      path: "/", // path
      // secure: true // https://...// Enable in production..
    });

    res.send({ accessToken });
  } catch (error) {
    console.log(error);
  }
});

router.post("/refresh", async (req, res) => {
  // Get token from cookie
  const { refreshToken } = req.cookies;

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
    console.log(user);
    // const user = await User.findOne({ _id: ObjectId(id) });
    res.json({
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
    const { refreshToken } = req.cookies;

    // If user hasn't sent a refreshtoken from cookie....
    if (!refreshToken) return res.sendStatus(400);

    // Find the sent refresh token and
    await Auth.findOneAndDelete({
      refreshToken,
    });

    // Clear the cookie after token deletion
    res.clearCookie("refreshToken", { options: {} });
    res.send(204);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Roles
// 1 - admin
// 2 - staff
// 3 - user

module.exports = router;
