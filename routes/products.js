const router = require("express").Router();
// Import model and validation schema
const { Product, validationSchema } = require("../model/Product");

// Import middlewares
const validateMongoId = require("./middlewares/validateMongoId");
const validateRequest = require("./middlewares/validateRequest");

// api/products GET...
router.get("/", async (req, res) => {
  try {
    // do it in query
    const allProducts = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $addFields: {
          category: {
            $first: "$category",
          },
        },
      },
    ]);

    // allProducts map....get the first element from the array
    // const productsWithCategory = allProducts.map((product) => {
    //   return {
    //     ...product,
    //     category: product.category[0],
    //   };
    // });

    // res.send(productsWithCategory);
    res.send(allProducts);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error");
  }
});

router.post("/", validateRequest(validationSchema), async (req, res) => {
  try {
    // Backend - rule...
    // To avoid adding duplicate products ... exercise
    // Don't let the user add products that already exists..
    // name..

    const { name } = req.body;

    const foundData = await Product.findOne({ name });

    if (!foundData) {
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();
      res.send(savedProduct);
    } else {
      res
        .status(409)
        .send(
          "Product with the same name exists. Please change the product's name"
        );
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Error");
  }
});

router.put(
  "/:id",
  [validateRequest(validationSchema), validateMongoId],
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (updatedData) {
        res.send(updatedData);
      } else {
        res.send(404).send("Product not found.");
      }
    } catch (e) {
      console.log(e);
      res.status(500).send("Error");
    }
  }
);

router.delete("/:id", validateMongoId, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await Product.deleteOne({ _id: id });
    if (deletedData.deletedCount === 1) {
      res.send(deletedData).status(204);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Error");
  }
});

module.exports = router;
