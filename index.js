const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
var flash = require("connect-flash");

dotenv.config();
const todoRoute = require("./router/todorouter");
const userRoute = require("./router/userRouter");
const adminRoute = require("./router/adminRoute");
const app = express();

app.use(express.json());
// app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(flash());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(__dirname + "public"));

// app.get("/", function (req, res) {
//   res.render("login");
// });

// app.use("/todo", todoRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);

// console.log(process.env.MONGO_DB_URI);
// DB conection
mongoose.connect(process.env.MONGO_DB_URI, {});
mongoose.connection
  .once("open", function () {
    console.log("Connected to Mongo");
  })
  .on("error", function (err) {
    console.log("Mongo Error", err);
  });

app.listen(3000, () => {
  console.log("Server is up and running at the port 3000");
});
