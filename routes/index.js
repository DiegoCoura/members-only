const express = require("express");
const router = express.Router();
const passport = require("passport");
const indexController = require("../controller/indexController");
const { login_middleware } = require("../middlewares/loginMiddleware");

router.get("/", indexController.index);

router.get("/sign-up", indexController.signup_get);

router.post("/sign-up", indexController.signup_post);

router.get("/login", indexController.login_get);

router.post(
  "/login",
  login_middleware,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  })
);

router.get("/logout", indexController.logout);

router.post("/message/new", indexController.send_message_post);

router.post("/message/delete", indexController.delete_message_post);

router.get("/secret-question", indexController.secret_question_get);

router.post("/secret-question", indexController.secret_question_post);

module.exports = router;
