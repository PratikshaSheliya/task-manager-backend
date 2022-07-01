const mysql = require("mysql");
const express = require("express");
const router = express.Router();
const cors = require("cors");
router.use(cors());
const auth = require("../middleware/auth")
const multer = require("multer");
const path = require('path')
const nodemailer = require("nodemailer");
const { signup, login, loggedin ,userData,profile,profileData,sendMail,Password} = require("../controller/users");

//multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      callBack(null, "./public/images/"); // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
      callBack(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  
  var upload = multer({
    storage: storage,
  });


router.post("/signup", signup);

router.post("/login", login);

router.get("/userdata",userData)

router.put("/profile", upload.single('image'),profile)

router.get("/profiledata",auth.token,profileData)

router.get("/loggedin", auth.token, loggedin);

router.post("/sendmail", sendMail);

router.put("/password", Password);

module.exports = router;
