const router = require("express").Router();

// Import model and it's validation schema
const { Category, validationSchema } = require("../model/Category");

// Import middleware
const validateRequest = require("./middlewares/validateRequest");

router.get("/", async (req, res) => {
  const allCategories = await Category.find();
  res.send(allCategories);
});

router.post("/", validateRequest(validationSchema), async (req, res) => {
  try {
    const { name } = req.body;
    // Post body, new post data - done
    // Validate - if ok or not.. - done
    // Check if category already exists - done
    // Add category - done

    const categoryExists = await Category.findOne({ name });
    if (!categoryExists) {
      // Add
      const newCategory = new Category({ name });
      const savedCategory = await newCategory.save();
      res.send(savedCategory);
    } else {
      // Conflict
      res.status(409).send("Category already exists!");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Error..");
  }
});

router.put("/:id", validateRequest(validationSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedData = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (updatedData) {
      res.send(updatedData);
    } else {
      res.status(404).send("Category not found.");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Error..");
  }
});

// name ???
// Id
// Do we need validation schema????
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await Category.deleteOne({ _id: id });
    if (deletedData.deletedCount === 1) {
      res.send(deletedData).status(204);
    } else {
      // this means, we could not find the id to delete
      res.status(404).send("Category not found.");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Error..");
  }
});

// Last - ..
module.exports = router;
