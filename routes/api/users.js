const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

//Load Models
const User = require("../../models/User");

//@router GET api/users/test
//@desc   Test user route
//access  public

router.get("/test", (req, res) => res.json({ msg: "User Works" }));

//@router GET api/users/register
//@desc   Register user
//access  public

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url({
        s: "200", //size
        r: "pg", //Rating
        d: "mm" //Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@router GET api/users/login
//@desc   Login User / Returning Token
//access  public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find The User by Email
  User.findOne({ email: email }).then(user => {
    //Check for User
    if (!user) {
      return res.status(404).json({ email: "User Email Not Found" }); //Send an Error Status
    }

    //Check Password
    bcrypt
      .compare(password, user.password) //(password,hash password)
      .then(isMatch => {
        if (isMatch) {
          //User Matched

          //Create JWT Playload
          const playload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          };

          //Sign Token
          jwt.sign(
            playload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          ); //key expire in an hour
        } else {
          res.status(404).json({ password: "Password Incorrect" });
        }
      });
  });
});

module.exports = router;
