const express = require("express");
const router = express.Router();
const passport = require("passport");
const indexController = require("../controller/indexController");

router.get("/", indexController.index);

router.get("/sign-up", indexController.signup_get);

router.post("/sign-up", indexController.signup_post);

router.get("/login", indexController.login_get);

router.post(
  "/login",
  passport.authenticate("local"),
  indexController.login_post
);

router.get("/logout", indexController.logout);

router.post("/message/new", indexController.send_message_post);

router.get("/secret-question", indexController.secret_question_get);

router.post("/secret-question", indexController.secret_question_post);

module.exports = router;
