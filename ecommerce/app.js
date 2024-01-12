const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
// const expressValidator = require("express-validator");

require("dotenv").config();
const mongoose = require("mongoose");

// import routes
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");
const categoryRoutes = require("./routes/category.js");
const productRoutes = require("./routes/product.js");

// app
const app = express();

// db
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("DB is connected"));

// middlewares
app.use(morgan("tiny"));
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(cookieParser());
// app.use(expressValidator());

const port = process.env.PORT || 8000;

// routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
