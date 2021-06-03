// Middleware -> a fn that runs before a route is hit.
// User -> Middleware (tests...if passed goes to next() -> route) -> hit route...

// Middleware fn..
const validateRequest = (validationSchema) => async (req, res, next) => {
  try {
    await validationSchema.validate(req.body);
    next();
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e.errors.join(", ") });
  }
};

module.exports = validateRequest;
