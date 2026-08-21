const express = require("express");

const {createTask,getTasks,updateTask,deleteTask,getTaskAnalytics} = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createTask);
router.get("/",protect,getTasks);
router.get("/analytics", protect, getTaskAnalytics);
router.put("/:id",protect,updateTask);
router.delete("/:id",protect,deleteTask);

module.exports = router;
