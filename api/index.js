const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User.js");
require("dotenv").config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "fasefraw45hjgsjhhjgs6kjl";

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// console.log(process.env.MONGO_URL)

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("test ok");
});

//10pEwfPy6Nq8F2K9

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  // res.json({ name, email, password });
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const UserDoc = await User.findOne({ email });
  if (UserDoc) {
    const passOk = bcrypt.compareSync(password, UserDoc.password);
    if (passOk) {
      jwt.sign(
        { email: UserDoc.email, id: UserDoc.id },
        jwtSecret,
        {},
        (err, token) => {
          if(err) throw err;
          res.cookie("token", token).json("pass ok");

        }
      );
      // res.json('pass ok');
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.json("not found");
  }
});
app.listen(4000);
