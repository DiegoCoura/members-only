const { body, validationResult, checkSchema } = require("express-validator");
const { signUpValidationSchema } = require("../utils/validationSchemas");
const db = require("../db/queries");
const { hashPassword } = require("../utils/passwordUtils");
const moment = require("moment-timezone")

exports.index = async (req, res, next) => {
  try {
    const currTimeZone = moment.tz.guess();
    console.log(currTimeZone)
    const messages = await db.getAllMessages();
    if (!req.user) {
      res.render("index", { moment: moment, user: "", messages: messages });
      return;
    }
    const user = {
      user_id: req.user.user_id,
      username: req.user.username,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      membership_status: req.user.membership_status,
    };
    res.render("index", { moment: moment, user: user, messages: messages });
  } catch (err) {
    next(err);
  }
};

exports.login_get = (req, res, next) => {
  if (req.user) return res.redirect("/");
  if (req.session.messages) {
    const error = req.session.messages[0];
    const errors = [
      {
        path: error.split(" ")[1],
        msg: error,
      },
    ];
    req.session.messages = undefined;
    res.render("loginForm", { errors: errors });
    return;
  }
  res.render("loginForm");
  return;
};

exports.logout = (req, res, next) => {
  if (!req.user) return res.sendStatus(401);
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};

exports.signup_get = (req, res, next) => {
  res.render("signupForm");
};

exports.signup_post = [
  checkSchema(signUpValidationSchema),
  async (req, res, next) => {
    try {
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
          if (!firstErrors.find((sameErr) => sameErr.path === err.path)) {
            firstErrors.push(err);
          }
        });
        res.render("signupForm", {
          user: newUser,
          errors: firstErrors,
        });
        return;
      }
      newUser.password = hashPassword(newUser.password);
      await db.createNewUser(newUser);
      res.redirect("/login");
    } catch (err) {
      next(err);
    }
  },
];

exports.send_message_post = [
  [
    body("new_message")
      .isLength({ min: 1, max: 250 })
      .withMessage("Message must contain below 280 characters."),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const newMsg = {
        user_id: req.user.user_id,
        message: req.body.new_message,
      };
      if (!errors.isEmpty()) {
        res.render("index", {
          message: newMsg.message,
          errors: errors.array(),
        });
        return;
      } else {
        const insertMsg = await db.createNewMessage(newMsg);
        if (!insertMsg) {
          const error = new Error("Failed to save data!");
          error.status = 500;
          return next(error);
        }
        res.redirect("/");
      }
    } catch (err) {
      next(err);
    }
  },
];

exports.delete_message_post = async (req, res, next) => {
  try {
    if (!req.user) {
      const err = new Error("Unauthorized");
      err.status = 401;
      return next(err);
    }
    await db.deleteMessage(req.body.msg_id, req.user.user_id);
    return res.redirect("/");
  } catch (err) {
    next(err);
  }
};

exports.secret_question_get = (req, res, next) => {
  try {
    if (!req.user) {
      const error = new Error("Unauthorized");
      error.status = 401;
      res.render("error", {
        error: error,
        message: "You must create an account first!",
      });
    } else if (req.user.membership_status) {
      res.redirect("/");
    } else {
      res.render("secretQuestionForm");
    }
  } catch (err) {
    next(err);
  }
};

exports.secret_question_post = [
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

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render("secretQuestionForm", {
          errors: errors.array(),
        });
        return;
      } else {
        await db.setMembershipTrue(req.user.user_id);
        res.redirect("/");
      }
    } catch (err) {
      next(err);
    }
  },
];
