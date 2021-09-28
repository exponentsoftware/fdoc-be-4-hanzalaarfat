const express = require("express");
const router = express.Router();
const todocontroller = require("../controller/todocontroller");

router.get("/", todocontroller.getalltodo); // isi route pe all todo aur filter query bhi hoga
router.get("/:_id", todocontroller.getalltodoByUserId);
// router.post("/add", todocontroller.addtodo);
router.get("/:id", todocontroller.gettodoById);
// router.put("/:id", todocontroller.updatetodo);
// router.delete("/:id", todocontroller.deletetodo);
// // router.get('/count/:id', todocontroller.taskCount);

module.exports = router;
