const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const { redirect } = require("express/lib/response");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");
const User = require("../models/User.model");

const saltRounds = 10;

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  if (!password && !email) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your email and password.",
    });
    return;
  } else if (!password) {
    res.render("auth/signup", {
      errorMessage: "Please provide your password.",
    });
    return;
  } else if (!email) {
    res.render("auth/signup", { errorMessage: "Please provide your email." });
    return;
  }
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hash) => {
      const UserDetails = {
        email: email,
        passwordHash: hash,
      };
      return User.create(UserDetails);
    })
    .then((userFromDB) => res.redirect("/"))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else {
        next(error);
      }
    });
});

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  if (!password || !email) {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/user-profile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((err) => console.log(err));
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
