const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("./keys");

//opts - options
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_playload, done) => {
      //   console.log(jwt_playload);
      User.findById(jwt_playload.id)
        .then(user => {
          if (user) {
            return done(null, user); //if user is found
          }
          return done(null, false); //if user is not found
        })
        .catch(err => console.log("Error :" + err));
    })
  );
};
