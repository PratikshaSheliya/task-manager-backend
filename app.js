const express = require("express");
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express();
const port = 5000;
const conn = require("./connection/conn");
const router = require("./routes/route");
const taskrouter = require("./routes/task")
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("./public"))
app.use(cors())
app.use(router);
app.use(taskrouter);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => console.log(` app listening on port ${port}!`));
