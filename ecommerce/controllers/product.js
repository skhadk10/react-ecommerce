const Product = require("../models/product");
// const fs = require("fs-extra");
const _ = require("lodash");
// const formidable = require("formidable");
const { errorHandler } = require("../helper/index.js");
const multer = require("multer");
const { query } = require("express");

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("photo");

exports.create = async (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const { name, description, price, category, shipping, quantity } =
        req.body;
      const file = req.file;
      if (
        !name ||
        !description ||
        !price ||
        !category ||
        !shipping ||
        !quantity
      ) {
        return res.status(404).json({
          error: "All fields are required",
        });
      }

      const product = new Product({
        name,
        description,
        price,
        category,
        shipping,
        quantity,
      });

      if (file) {
        if (file.size > 100000) {
          return res.status(400).json({
            error: "Image should be less that 1 mb in size",
          });
        }
        (product.photo.data = req.file.filename),
          (product.photo.contentType = req.file.mimetype); //contentType:"image/png"
      }
      console.log("product: " + product);
      product
        .save()
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          }
        });
    }
  });
};

exports.productById = (req, res, next, id) => {
  Product.findById(id)
    .then((product) => {
      req.product = product;
      next();
    })
    .catch((err) => {
      return res.status(400).json({
        error: "Product not found",
      });
    });
};

exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.remove = async (req, res) => {
  const product = req.product;

  if (!product) {
    return res.status(404).json({
      error: "Product not found",
    });
  }

  await product.deleteOne();

  res.json({
    message: "Product removed successfully",
  });
};

exports.update = async (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const { name, description, price, category, shipping, quantity } =
        req.body;
      // const fields = req.body;
      const file = req.file;
      if (
        !name ||
        !description ||
        !price ||
        !category ||
        !shipping ||
        !quantity
      ) {
        return res.status(404).json({
          error: "All fields are required",
        });
      }

      let product = req.product;
      product = _.extend(product, req.body);
      if (file) {
        if (file.size > 100000) {
          return res.status(400).json({
            error: "Image should be less that 1 mb in size",
          });
        }
        (product.photo.data = req.file.filename),
          (product.photo.contentType = req.file.mimetype); //contentType:"image/png"
      }
      console.log(product, "hello product updated");
      product
        .save()
        .then(() => {
          res.json({ message: "product is updated" });
        })
        .catch((err) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          }
        });
    }
  });
};
// sell/arrival
// by sell=/products?sortBy=sold&order=desc&limit=4
// by arrival=/products?sortBy=createdAt&order=desc&limit=4
// if no params are sent, then all products are returned

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .then((data) => res.json(data))
    .catch((err) => {
      if (err) {
        return res.status(400).json({
          error: "product not found",
        });
      }
    });
};

exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("category", "_id name")
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({
          error: "product not found",
        });
      }
    });
};

exports.listCategories = (req, res) => {
  Product.distinct("category")
    .then((category) => {
      res.json(category);
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({
          error: "category not found",
        });
      }
    });
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .then((data) => {
      res.json({
        size: data.length,
        data,
      });
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
    });
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.listSearch = (req, res) => {
  // create query object to hold search value and category value
  const query = {};
  // assign search value to query.name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
    // assign category value to query.category
    if (req.query.category && req.query.category != "All") {
      query.category = req.query.category;
    }
    // find the product ased on query object with 2 properties
    // search and category

    // find the product based on the query object with 2 properties
    // search and category
    const product = Product.find(query)
      .select("-photo")
      .then((data) => {
        // console.log(data,"query-data")
        res.json({
          data,
        });
      })
      .catch((err) => {
        if (err) {
          return res.status(400).json({
            error: "Products not found",
          });
        }
      });
  }
};

// exports.create = (req, res) => {
//   let form = new formidable.IncomingForm();
//   form.keepExtension = true;

//   form.parse(req, async (err, fields, files) => {
//     let {photo}=files
//     if (err) {
//       return res.status(400).json({
//         error: "Image could not be uploaded",
//       });
//     }
//     console.log({photo},"files")
//     let product = new Product(fields, { photo: {
//       data:req.files,
//       contentType:'image/png'
//     } });

//     try {
//       const savedProduct = await product.save();
//       console.log(savedProduct, "final");
//       res.json(savedProduct); // Send a response with the saved product data
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         error: "Failed to save the product",
//       });
//     }
//   });
// };
