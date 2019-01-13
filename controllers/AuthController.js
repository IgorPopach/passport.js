var mongoose = require("mongoose");
var passport = require("passport");
const jwt = require('jsonwebtoken');
var User = require("../models/User");

var userController = {};

// Restrict access to root page
userController.home = function (req, res) {
  res.render('index', { user: req.user });
};

// Go to registration page
userController.register = function (req, res) {
  res.render('register');
};

// Post registration
userController.doRegister = function (req, res) {
  User.register(new User({ username: req.body.username, name: req.body.name }), req.body.password, function (err, user) {
    if (err) {
      return res.render('register', { user: user });
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
};

// Go to login page
userController.login = function (req, res) {
  res.render('login');
};

// Post login
userController.doLogin = function (req, res) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign(user.toJSON(), 'keyboard cat');
      return res.json({ user, token });
    });
  })(req, res, function () {
    res.redirect('/');
  });
};

// logout
userController.logout = function (req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = userController;
