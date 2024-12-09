'use strict';
require('dotenv').config();
const passport = require("passport")
const { ObjectID } = require('mongodb');
const LocalStrategy = require('passport-local');
const bcrypt = require("bcryptjs")
const GitHubStrategy = require('passport-github').Strategy;






module.exports = function (app, myDataBase) {

   //check connection
   passport.use(new LocalStrategy((username, password, done) => {
    myDataBase.findOne({ username: username }, (err, user) => {
      console.log(`User ${username} attempted to log in.`);
      if (err) return done(err);
      if (!user) return done(null, false);
      if (!bcrypt.compareSync(password, user.password)) return done(null, false);
      return done(null, user);
    });
  }));
    //serialize
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });
    //deserialize
    passport.deserializeUser((id, done) => {
      myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
        done(null, doc);
      });
    });




    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "https://chat-app-y4bw.onrender.com/auth/github/callback"

      },
        function(accessToken, refreshToken, profile, cb) {
          console.log(profile);
          //Database logic here with callback containing your user object
          myDataBase.findOneAndUpdate(
            { id: profile.id },
            {
              $setOnInsert: {
                id: profile.id,
                username: profile.username,
                name: profile.displayName || 'John Doe',
                photo: profile.photos[0].value || '',
                email: Array.isArray(profile.emails)
                  ? profile.emails[0].value
                  : 'No public email',
                created_on: new Date(),
                provider: profile.provider || ''
              },
              $set: {
                last_login: new Date()
              },
              $inc: {
                login_count: 1
              }
            },
            { upsert: true, new: true },
            (err, doc) => {
              return cb(null, doc.value);
            }
          );
        }
      ));
}
