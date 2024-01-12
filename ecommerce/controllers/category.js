const { errorHandler } = require("../helper/index.js");
const Category = require("../models/category.js");

exports.create = (req, res) => {
 
  const category = new Category(req.body);
  category
    .save()
    .then((category) => {
      res.json({
        category,
      })
    })
    .catch((err) => {
      if (err) return res.status(400).json({ error: errorHandler(err) });
    });
  console.log(category);
};
