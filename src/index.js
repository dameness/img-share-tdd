let express = require("express");
let app = express();
let mongoose = require("mongoose");
let user = require("./models/User")

app.use(express.urlencoded({extended:false}))/
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/img-share")
  .then(() => {
    
  }).catch(err => {
    console.error(err);
  })

let User = mongoose.model("User", user);

app.get("/", (req, res) => {
  res.send("Ok.")
})

app.post("/user", async (req, res) => {

  try{

    let { name, email, password } = req.body;
    let newUser = new User({name, email, password});
    await newUser.save();
    res.json({email});

  }catch(err){
    res.sendStatus(500);
  }

})

module.exports = app;