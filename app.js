const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressSession = require("express-session");
const pgSession = require("connect-pg-simple")(expressSession);
const pgPool = require("./db/pool");
const passport = require("passport");
const helmet = require("helmet");
const compression = require("compression");
const requestIp = require('request-ip');
require("./strategies/local-strategy");

require("dotenv").config();

const app = express();

app.use(helmet());
app.use(compression()); // Compress all routes

app.use(requestIp.mw())
app.use(function(req, res, next) {
  const ip = req.clientIp;
  next();
});

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50, // limit for each IP per `window`
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(limiter);

const routes = require("./routes/index");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const sessionStore = new pgSession({
  pool: pgPool, // Connection pool
  tableName: "users_sessions", // Use another table-name than the default "session" one
  // Insert connect-pg-simple options here
});

app.use(
  expressSession({
    store: sessionStore,
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60, // 1 hour
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
