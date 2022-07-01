const mysql = require("mysql");
const express = require("express");
const taskrouter = express.Router();
const auth = require("../middleware/auth")
const {task, allTask, userTask,editTask,updateTask,DeleteTask,ShowuserTask} = require("../controller/task")

taskrouter.post("/task", auth.token, task)
taskrouter.get("/alltask", auth.token, allTask)
taskrouter.get("/usertask", auth.token, userTask)
taskrouter.get("/edittask", editTask)
taskrouter.put("/updatetask", updateTask)
taskrouter.delete("/deletetask", DeleteTask)
taskrouter.get("/showtask", ShowuserTask)

module.exports = taskrouter;
