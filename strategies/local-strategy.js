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
  new Strategy( { passReqToCallback: true},async (req, username, password, done) => {
    console.log(req.session.messages)
    try {
      const findUser = await db.findByEmail(username);
      if (!findUser) {
        return done(null, false, { message: "Incorrect username"})
      };
      if (!comparePassword(password, findUser.hash)) {
        return done(null, false, { message: "Incorrect password"})
      }
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);

