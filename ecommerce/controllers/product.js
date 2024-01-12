const Product = require("../models/product");
const fs = require("fs-extra");
const _ = require("lodash");
const formidable = require("formidable");
const { errorHandler } = require("../helper/index.js");

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtension = true;

  form.parse(req,async  (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }



    let product = new Product(fields);
    let filesPhoto= files.photo
    console.log(filesPhoto,"filesPhoto");
    let filesphoto1=filesPhoto.filepath
    console.log(filesphoto1,"filesPhoto=====1");
    if (files.photo) {
      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.mimetype;
    }
    try {
      const savedProduct = await product.save();
      console.log(savedProduct, "final");
      res.json(savedProduct); // Send a response with the saved product data
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Failed to save the product",
      });
    }
  });
};