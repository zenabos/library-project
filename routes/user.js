const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");
const User = require("../models/User.model");

router.get("/user-profile", isLoggedIn, (req, res) => {
  res.render("users/user-profile", {
    userInSession: req.session.currentUser,
  });
});

router.post(
  "/user/add",
  (req, res, next) => {
    User.findByIdAndUpdate(req.session.currentUser._id, {name: req.body.name} )
    .then(()=> {
        User.findById(req.session.currentUser._id)
        .then((user) => {
            req.session.currentUser = user;
        })
    })
    
    .then(() => res.redirect('/user-profile'))
    .catch((err) => {
      console.log("error", err);
    });
  });

  

module.exports = router;
