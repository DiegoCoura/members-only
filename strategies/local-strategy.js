const passport = require("passport");
const { Strategy } = require("passport-local");
const db = require("../db/queries");
const { comparePassword } = require("../utils/passwordUtils");

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await db.findById(userId);    
    if(!user) throw new Error("User Not Found")
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new Strategy(async (username, password, done) => {
    console.log(`Username: ${username}, Password: ${password}`);
    try {
      const findUser = await db.findByEmail(username);
      if (!findUser) throw new Error("User not found");
      if (!comparePassword(password, findUser.hash)) throw new Error("Bad credentials");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);

