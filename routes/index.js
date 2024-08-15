const express = require("express");
const router = express.Router();
const { body, validationResult, checkSchema } = require("express-validator");
const db = require("../db/queries");
const passport = require("passport");
const { hashPassword } = require("../utils/passwordUtils");
const { signUpValidationSchema } = require("../utils/validationSchemas");

/* GET home page. */
router.get("/", (req, res, next) => {
  req.sessionStore.get(req.session.id, (err, sessionData) => {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(sessionData);
  });
  req.session.visited = true;
  res.render("index");
});

router.get("/sign-up", (req, res, next) => {
  res.render("signupForm");
});

router.post(
  "/sign-up",
  checkSchema(signUpValidationSchema),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const newUser = {
      username: req.body.username,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    };
    try {
      newUser.password = hashPassword(newUser.password);
      const saveUser = await db.createNewUser(newUser);
      console.log(saveUser);
      res.redirect("/login");
    } catch (err) {
      next(err, null);
    }
  }
);

router.get("/login/status", (req, res, next) => {
  console.log(req.user);
  console.log(req.session);

  return req.user ? res.send(req.user) : res.sendStatus(401);
});

router.get("/login", (req, res, next) => {
  res.render("loginForm");
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  return res.send("You are logged in");
});

router.get("/logout", (req, res, next) => {
  if (!req.user) return res.sendStatus(401);
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
