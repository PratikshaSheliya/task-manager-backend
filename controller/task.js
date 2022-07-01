const conn = require("../connection/conn");
const multer = require('multer')
//post task
exports.task = async (req, res) => {
  try {
    const { taskname, taskdate, tasktime, status, userid } = req.body;
    values = [[taskname, taskdate, tasktime, status, userid]];
    sql =
      "INSERT INTO tasks (taskname, taskdate, tasktime, status, userid)  VALUES ?";
    conn.query(sql, [values], (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log("insert successfully");
        res.status(200).send(result);
      }
    });
  } catch (error) {
    res.status(401).send(error);
  }
};

//all task
exports.allTask = async (req, res) => {
  try {
    sql = "SELECT * FROM tasks";
    conn.query(sql, (err, result) => {
      res.status(200).send(result);
    });
  } catch (error) {
    res.status(400).send({ result: result });
  }
};

//login user by task
exports.userTask = async (req, res) => {
  try {
    let userId = req.userData.id;
    sql = `SELECT * FROM tasks WHERE userid=${userId} ORDER BY taskdate ASC`;
    conn.query(sql, (err, result) => {
      res.status(200).send(result);
    });
  } catch (error) {
    res.status(401).send({ error });
  }
};

//edit task &&  particular user get data
exports.editTask = async (req, res) => {
  try {
    sql = "SELECT * FROM tasks WHERE id = ?";
    values = [[req.query.id]];
    conn.query(sql, [values], (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log("result", result);
        res.status(200).send(result);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

//update task
exports.updateTask = async (req, res) => {
  try {
    sql = `UPDATE tasks SET taskname='${req.body.taskname}',taskdate='${req.body.taskdate}',tasktime='${req.body.tasktime}',status='${req.body.status}', userid='${req.body.userid}' WHERE id = '${req.body.taskid}'`;
    conn.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log("result", result);
        res.status(200).send({ result: result, msg: "update" });
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

//delete task
exports.DeleteTask = async (req, res) => {
  try {
    console.log("req.body.id",req.query.id)
    sql = `DELETE FROM tasks WHERE id = ${req.query.id}`;
    conn.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log("delete");
        res.status(200).send(result);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

//ShowuserTask
exports.ShowuserTask = async (req,res)=>{
  try {
    console.log("id",req.query.id)
    sql = `SELECT users.name,users.email,tasks.* FROM users LEFT JOIN tasks ON users.id = tasks.userid WHERE users.id= '${req.query.id}'`
    conn.query(sql,(err,result)=>{
      if(err){
        throw err
      }
      else{
        console.log("result",result);
        res.status(200).send(result)
      }
    })
  } catch (error) {
    res.status(400).send(error)
  }
}