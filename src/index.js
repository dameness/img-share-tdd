let express = require("express");
let app = express();
let mongoose = require("mongoose");

app.use(express.urlencoded({extended:false}))/
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/img-share")
  .then(() => {
    console.log("Conectado com o banco de dados!");
  }).catch(err => {
    console.error(err);
  })

app.get("/", (req, res) => {
  res.send("Ok.")
})

module.exports = app;