const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mysql_project",
  multipleStatements: true,
});

conn.connect((err) => {
  if (err) {
    console.log("connection failed");
  } else {
    console.log("connection successfully.");
  }
});
module.exports = conn;
