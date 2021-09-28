const express = require("express");
const router = express.Router();
const usercontroller = require("../controller/userController");
const todocontroller = require("../controller/todocontroller");
const adminController = require("../controller/adminController");

const adminAutcontroller = require("../Middleware/authenticate");

router.get("/signup", usercontroller.GetSignup);
router.get("/login", adminController.GetLogin);

router.post("/signup", usercontroller.signup);
router.post("/login", adminController.login);
router.get(
  "/todo",
  adminAutcontroller.requireSigninAdmin,
  adminController.getalltodoByAdmin
); //isi route pe all todo aur filter query bhi hoga

router.post(
  "/todo/add",
  adminAutcontroller.requireSigninAdmin,
  todocontroller.addtodo
);
router.get(
  "/todo/:id",
  adminAutcontroller.requireSigninAdmin,
  todocontroller.gettodoById
);
router.put(
  "/todo/:id",
  adminAutcontroller.requireSigninAdmin,
  todocontroller.updatetodo
);
router.delete(
  "/todo/:id",
  adminAutcontroller.requireSigninAdmin,
  todocontroller.deletetodo
);

module.exports = router;
