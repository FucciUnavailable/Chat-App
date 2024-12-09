require('dotenv').config();

const passport = require('passport');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

module.exports = function (app, myDataBase) {
  // Home Route
  app.route('/').get((req, res) => {
    res.render('index', {
      title: 'Connected to Database',
      message: 'Please log in',
      showLogin: true,
      showRegistration: true,
      showSocialAuth: true,
    });
  });

  // Login Route
  app.post(
    '/login',
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/profile');
    }
  );

  // Profile Route
  app.route('/profile').get(ensureAuthenticated, (req, res) => {
    res.render('profile', { username: req.user.username });
  });

  // Logout Route
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // Registration Route
  app
    .route('/register')
    .post(
      (req, res, next) => {
        myDataBase.findOne({ username: req.body.username }, (err, user) => {
          if (err) {
            next(err);
          } else if (user) {
            res.redirect('/');
          } else {
            const hash = bcrypt.hashSync(req.body.password, 12);
            myDataBase.insertOne(
              { username: req.body.username, password: hash },
              (err, doc) => {
                if (err) {
                  res.redirect('/');
                } else {
                  next(null, doc.ops[0]);
                }
              }
            );
          }
        });
      },
      passport.authenticate('local', { failureRedirect: '/' }),
      (req, res) => {
        res.redirect('/profile');
      }
    );

  // GitHub Authentication
  app.get('/auth/github', passport.authenticate('github'));
  app.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/chat');
    }
  );

  // Chat Routes
  app.get('/chat', ensureAuthenticated, (req, res) => {
    res.render('chat', { user: req.user });
  });

  app.get('/private', ensureAuthenticated, (req, res) => {
    res.render('private', { user: req.user });
  });

  // Private Room Join
  app.post('/private', ensureAuthenticated, (req, res) => {
    const roomId = req.body.roomId.trim();
    if (!roomId) {
      return res.redirect('/private'); // Redirect back to private form if empty
    }
    res.redirect(`/private/${roomId}`);
  });

  // Dynamic Private Room Route
  app.get('/private/:roomId', ensureAuthenticated, (req, res) => {
    const roomId = req.params.roomId;
    res.render('private', { username: req.user.username, roomId });
  });

  // 404 Handler
  app.use((req, res) => {
    res.status(404).type('text').send('Not Found');
  });
};

// Middleware for Authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
