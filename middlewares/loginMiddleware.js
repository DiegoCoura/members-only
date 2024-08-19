const { body, validationResult } = require("express-validator");

exports.login_middleware = [
  body("username").notEmpty().withMessage("Insert your username"),
  body("password")
    .isLength({ min: 6, max: 20 })
    .withMessage("Your password contain between 6 and 20 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("loginForm", { errors: errors.array() });
      return;
    }
    return next();
  },
];
