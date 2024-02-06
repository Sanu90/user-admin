const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const user = require("../controllers/user");
const userModel = require("../models/database");
//const userManage=require('../controllers/admin')

var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use((req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});

router.use(
  session({
    secret: "user_private_key",
    resave: false,
    saveUninitialized: false,
  })
);

function userAuth(req, res, next) {
  if (req.session.isUserAuth) {
    next();
  } else {
    res.redirect("/");
  }
}

router.get("/", (req, res) => {
  if (req.session.isUserAuth) {
    res.redirect(`/login/${req.session.username}`);
  } else {
    invalidUname = req.query.errUser;
    invalidPass = req.query.errPassword;
    res.render("userLogin", { invalidPass, invalidUname });
  }
});

router.post("/", user.checkUserIn);

router.get("/wrong", user.checkUserOut);

router.get("/login/:username", userAuth, async (req, res) => {
  try {
    const email = req.session.email;
    const user = await userModel.findOne({ email: email });
    res.render("userHome", { Name: user.username, greeting: "Welcome" });
  } catch (e) {
    console.log(e);
    res.render("error", { errorMessage: "Error occurred" });
  }
});

function userSign(req, res, next) {
  if (req.session.isUserAuth) {
    res.redirect(`/login/${req.session.username}`);
  } else {
    next();
  }
}

router.get("/signup", userSign, (req, res) => {
  unamefound = req.query.message;
  emailmsg = req.query.emailmessage;
  res.render("userSignup", { unamefound, emailmsg });
});

router.post("/signup", user.addUser);

router.get("/ulogout", user.checkUserOut);

router.get("/error", (req, res) => {
  const errorMessage = req.query.errorMessage;
  console.log(errorMessage);
  res.render("error", { errorMessage });
});

module.exports = router;
