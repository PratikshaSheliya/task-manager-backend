const conn = require("../connection/conn");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");
dotenv.config();
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      throw err;
    } else {
      let query = "SELECT * FROM users WHERE email =?";
      var values = [[email]];
      conn.query(query, values, (err, result) => {
        if (result.length) {
          res.status(409).send({
            msg: "This user is already in use!",
          });
        } else {
          var sql = "INSERT INTO users (name,email,password) VALUES ?";
          var values = [[name, email, hash]];
          conn.query(sql, [values], function (err, result) {
            res.send({
              message: "data insert successfully",
              result: result,
            });
          });
        }
      });
    }
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  sql = "SELECT * FROM users WHERE email = ?";
  values = [[email]];
  conn.query(sql, [values], (err, result) => {
    if (!result.length) {
      res.status(401).send({
        msg: "User Not Found",
      });
    } else {
      bcrypt.compare(req.body.password, result[0].password, (bErr, bResult) => {
        if (bErr) {
          res.status(401).send({
            msg: "berror!",
            token,
            user: result[0],
          });
        } else if (bResult) {
          const token = jwt.sign(
            {
              name: result[0].name,
              email: result[0].email,
              id: result[0].id,
            },
            process.env.SECRETKEY
          );
          conn.query(
            `UPDATE users SET last_login = now()  WHERE id = ${result[0].id}`
          );
          res.status(200).send({
            msg: "Logged in!",
            token,
            user: result[0],
          });
        } else {
          res.status(401).send({
            meassage: "Username or password is incorrect!",
          });
        }
      });
    }
  });
};

exports.userData = async(req, res) => {
  try {
    sql = "SELECT * FROM users";
     conn.query(sql, async(err, result) => {
      if (err) {
        throw err;
      } else {
        const result_array = [];
        result?.map(async(data)=>
        {
          countsql = ` SELECT  COUNT(*) totalCount, users.name, users.email,users.id FROM users INNER JOIN tasks  ON users.id = tasks.userid WHERE users.id = ${data.id}`;
         conn.query(countsql
            ,async(err, countResult) => {
            if (err) {
              throw err;
            } else {
              result_array.push(countResult[0]);
              if(result_array.length == result.length)
               return res.status(200).json(result_array);
            }
          }
          )
        })
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

//put profile date
exports.profile = async (req, res) => {
  if (req.file) {
    console.log("req.file.filename", req.file.filename);
    var imgsrc = "http://localhost:5000/images/" + req.file.filename;
    sql = `UPDATE users SET address='${req.body.address}',phonenumber='${req.body.phonenumber}',birth_date='${req.body.birth_date}',gender='${req.body.gender}', image='${imgsrc}' WHERE id = '${req.body.id}'`;
    conn.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.status(200).send(result);
      }
    });
  } 
  else {
    sql = `UPDATE users SET address='${req.body.address}',phonenumber='${req.body.phonenumber}',birth_date='${req.body.birth_date}',gender='${req.body.gender}' WHERE id = '${req.body.id}'`;
    conn.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.status(200).send(result);
      }
    });
  }
};

//get profile data
exports.profileData = async (req, res) => {
  try {
    let userId = req.userData.id;
    sql = `SELECT * FROM users WHERE id = '${userId}'`;
    conn.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.status(200).send(result);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

//send mail
exports.sendMail = async (req, res) => {
  try {
    sql = `SELECT * FROM users WHERE email = '${req.body.email}'`;
    conn.query(sql, (err, result) => {
      if (!result.length) {
        res.status(401).send({
          msg: "User Not Found",
        });
      } else {
        to = req.body.email;
        url = `http://localhost:4200/forgotpassword?email=${result[0].id}`;
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "sheliyapratiksha.dds@gmail.com",
            pass: "nzmsvmaapxbgcxtd",
          },
        });

        var mailoptions = {
          from: "Task App Customer Support<sheliyapratiksha.dds@gmail.com>",
          to: to,
          html: `
         <h2>Forgot your Password?</h2>
         <h3>We received a request to reset the password for your account</h3>
         <h3>To reset your password , click on the link below</h3>
          <a href = "${url}">Click Here</a>
          `,
        };

        transporter.sendMail(mailoptions, (err, info) => {
          if (err) {
            console.log("sendmailerror", err);
          } else {
            // console.log("Email Sent" + info.response);
            alert("Email Sent");
          }
        });
        res.status(200).send({ meassage: "Email sent successfully.." });
      }
    });
  } catch (error) {
    // res.status(400).send("Email failed..");
  }
};

//forgot password
exports.Password = async (req, res) => {
  try {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        throw err;
      } else {
        sql = `UPDATE users SET password='${hash}' WHERE id = '${req.body.id}'`;
        conn.query(sql, (err, result) => {
          if (err) {
            throw err;
          } else {
            res.status(200).send(result);
          }
        });
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.loggedin = async (req, res) => {
  res.send({ data: req.userData, msg: "Successfully" });
};
