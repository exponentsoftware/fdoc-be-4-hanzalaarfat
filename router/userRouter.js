const express = require("express");
const router = express.Router();
const usercontroller = require("../controller/userController");
const todocontroller = require("../controller/todocontroller");
const userAutcontroller = require("../Middleware/authenticate");

router.get("/signup", usercontroller.GetSignup);
router.get("/login", usercontroller.GetLogin);
router.get("/user", usercontroller.userHome);

router.post("/signup", usercontroller.signup);

router.post("/login", usercontroller.login);

router.get("/todo", todocontroller.getalltodo); // user ki  id se hi get hoga   // isi route pe all todo aur filter query bhi hoga
router.post(
  "/todo/add",
  userAutcontroller.requireSignin,
  todocontroller.addtodo
);
router.get("/todo/:id", todocontroller.gettodoById);
router.put(
  "/todo/:id",
  userAutcontroller.requireSignin,
  todocontroller.updatetodo
);
router.delete("/todo/:id", todocontroller.deletetodo);

module.exports = router;
