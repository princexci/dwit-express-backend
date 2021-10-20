const router = require("express").Router();
const stripe = require("stripe")(
  "sk_test_51J5PCLHSkxfngDrUeib20Mhdx0Prs4S4evlhiJB9EQNnVpUhjewC7uaC1G5Zmz755Kesld6natW41klS7Uzwc1R600lXZGuvgC"
);

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { totalPrice } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice,
      currency: "usd",
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
