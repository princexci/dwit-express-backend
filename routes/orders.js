const router = require("express").Router();

const validateRequest = require("./middlewares/validateRequest");

const { Order, validationSchema } = require("../model/Order");
const nodemailer = require("nodemailer");

const transporter = require("../lib/transporter")();

router.post("/", validateRequest(validationSchema), async (req, res) => {
  try {
    console.log(req.body);
    const newOrder = new Order(req.body);
    const saved = await newOrder.save();

    if (saved) {
      // If order saved, send email to admin that the new order has been receieved.
      const info = await transporter.sendMail({
        from: `"Backend" <backend@dwitecommerce.com>`,
        to: "adminemailid@email.com",
        subject: "New order receieved.",
        text: `Order details: ${JSON.stringify(req.body, null, 2)}`,
      });

      console.log("Preview URL", nodemailer.getTestMessageUrl(info));

      res.json(saved);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/", async (req, res) => {});

module.exports = router;
