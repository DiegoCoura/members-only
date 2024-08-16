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
  res.render("index", { user: req.user });
});

router.get("/sign-up", (req, res, next) => {
  res.render("signupForm");
});

router.post(
  "/sign-up",
  checkSchema(signUpValidationSchema),
  async (req, res, next) => {
    const errors = validationResult(req);
    const newUser = {
      username: req.body.username,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    };
    
    if (!errors.isEmpty()) {
      const firstErrors = [];
      errors.errors.forEach((err) => {
        if(!firstErrors.find((sameErr) => sameErr.path === err.path)){
          firstErrors.push(err)
        }
      })
      res.render("signupForm",{ 
        user: newUser,
        errors: firstErrors });
      return 
    }
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
  return res.render("index", {
    user: req.user,
  });
});

router.get("/logout", (req, res, next) => {
  if (!req.user) return res.sendStatus(401);
  req.logout((err) => {
    if (err) return next(err);
    res.render("index", { user: req.user });
  });
});

router.get("/secret-question", (req, res, next) => {
  if (!req.user) {
    const error = new Error("Unauthorized");
    error.status = 401;
    res.render("error", {
      error: error,
      message: "You must create an account first!",
    });
  } else if(req.user.membership_status) {
    res.redirect("/");
  } else {
    res.render("secretQuestionForm");
  }
});

router.post(
  "/secret-question",
  [
    body("secret_code")
      .trim()
      .notEmpty()
      .withMessage("You must answer the question!")
      .toLowerCase()
      .custom((code) => {
        if (code != "scabbers") {
          throw new Error("Try again!");
        } else {
          return true;
        }
      }),
  ],
  async (req, res, next) => {
    console.log(req.user.user_id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("secretQuestionForm", {
        errors: errors.array(),
      });
      return
    } else {
      await db.setMembershipTrue(req.user.user_id)
      res.redirect("/");
    }
  }
);

module.exports = router;
