const { errorHandler } = require("../helper.js/helper.js");
const Category = require("../models/user.js");

exports.create = (req, res) => {
  const category = new Category(req.body);
  category
    .save()
    .then((category) => {
      res.json({
        category,
      });
    })
    .catch((err) => {
      if (err) return res.status(400).json({ error: errorHandler(err) });
    });
};
