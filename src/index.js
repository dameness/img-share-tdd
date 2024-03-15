let express = require("express");
let app = express();
let mongoose = require("mongoose");
let user = require("./models/User")
let bcrypt = require("bcrypt");

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

    if(name === "" || email === "" || password === ""){
      res.sendStatus(400);
      return;
    }

    let user = await User.findOne({"email": email})

    if(user != undefined){
      res.status(400).json({error:"E-mail já cadastrado!"});
      return;
    }

    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);
    password = hash;

    let newUser = new User({name, email, password});

    await newUser.save();
    res.json({email});

  }catch(err){
    res.sendStatus(500);
  }

})

//endpoint usado no "afterAll" na test suite de user
app.delete("/user/:email", async (req, res) => {
  await User.deleteOne({"email": req.params.email})
  res.sendStatus(200);
})

module.exports = app;