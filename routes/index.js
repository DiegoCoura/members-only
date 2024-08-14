const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const passport = require("passport");

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
  res.render("index", { title: "Express" });
});

router.get("/sign-up", (req, res, next) => {
  res.render("signupForm");
});

router.post("/sign-up", [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("first name must be provided")
    .isLength({ max: 20 })
    .withMessage("must contain 20 characters maximum"),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("last name must be provided")
    .isLength({ max: 20 })
    .withMessage("must contain 20 characters maximum"),
  body("username")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("An email must be provided")
    .custom(async (email) => {
      const inUse = await db.findByEmail(email);
      if (inUse) {
        throw new Error("User already exists!");
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 20 })
    .withMessage("password must contain between 6 and 20 characters."),
  async (req, res, next) => {
    try {
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
      const saveUser = await db.createNewUser(newUser);
      res.redirect("/login");
    } catch (err) {
      next(err, null);
    }
  },
]);
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
