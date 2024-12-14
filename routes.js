require("dotenv").config();

const passport = require("passport");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const flash = require("connect-flash");
const axios = require("axios");

const API_KEY = process.env.API_KEY;
module.exports = function (app, myDataBase) {
  app.use(flash());

  // Home Route
  app.route("/").get((req, res) => {
    res.render("index", {
      title: "Connected to Database",
      message: "Please log in",
      showLogin: true,
      showRegistration: true,
      showSocialAuth: true,
    });
  });
  // Home Route if Fail to log in
  app.route("/failureToLogIn").get((req, res) => {
    res.render("index", {
      title: "Connected to Database",
      message: "Please log in",
      showLogin: true,
      showRegistration: true,
      showSocialAuth: true,
      failureToLogIn: true,
      failureToSignUpClient: false,
      failureToSignUpServer: false,
    });
  });
  // Home Route if Fail to sign up client
  app.route("/failureToSignUpClient").get((req, res) => {
    res.render("index", {
      title: "Connected to Database",
      message: "Please log in",
      showLogin: true,
      showRegistration: true,
      showSocialAuth: true,
      failureToLogIn: false,
      failureToSignUpClient: true,
      failureToSignUpServer: false,
    });
  });
  // Home Route if Fail to sign up server
  app.route("/failureToSignUpClient").get((req, res) => {
    res.render("index", {
      title: "Connected to Database",
      message: "Please log in",
      showLogin: true,
      showRegistration: true,
      showSocialAuth: true,
      failureToLogIn: false,
      failureToSignUpClient: false,
      failureToSignUpServer: false,
    });
  });
    // Home Route if SUCCEED to sign up server
    app.route("/successToSignUp").get((req, res) => {
      res.render("index", {
        title: "Connected to Database",
        message: "Please log in",
        showLogin: true,
        showRegistration: true,
        showSocialAuth: true,
        failureToLogIn: false,
        failureToSignUpClient: false,
        failureToSignUpServer: false,
        successToSignUp:true
      });
    });
  




  // Login Route
  app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/failureToLogIn" }),
    (req, res) => {
      res.redirect("/profile");
    }
  );
  //api route for profile
  app.get("/api/random-fact", async (req, res) => {
    try {
      console.log("trying to fetch quote api");
      // Use Axios to fetch data
      const response = await axios.get("https://api.api-ninjas.com/v1/quotes", {
        headers: {
          "X-Api-Key": API_KEY,
        },
      });

      const data = response.data; // Axios automatically parses JSON
      console.log("fetched this to server:", data);
      if (!data || data.length === 0) {
        return res.json({ quote: "No facts available at the moment." });
      }

      const randomFact = data[0]; // Get the first quote
      res.json({
        quote: randomFact.quote,
        author: randomFact.author,
      });
    } catch (error) {
      console.error("Error fetching fact:", error.message);
      res
        .status(500)
        .json({ quote: "Failed to load fact. Please try again later." });
    }
  });
  // Profile Route
  app.route("/profile").get(ensureAuthenticated, (req, res) => {
    res.render("profile", { username: req.user.username });
  });

  // Logout Route
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Registration Route
  app.route("/register").post(
    (req, res, next) => {
      myDataBase.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
          next(err);
        } else if (user) {
          res.redirect("/failureToSignUpClient");
        } else {
          const hash = bcrypt.hashSync(req.body.password, 12);
          myDataBase.insertOne(
            { username: req.body.username, password: hash },
            (err, doc) => {
              if (err) {
                res.redirect("/failureToSignUpServer");
              } else {
                next(null, doc.ops[0]);
              }
            }
          );
        }
      });
    },
    passport.authenticate("local", { failureRedirect: "/" }),
    (req, res) => {
      req.flash("success", "You have successfully registered!");
      res.redirect("/successToSignUp");
    }
  );

  // GitHub Authentication
  app.get("/auth/github", passport.authenticate("github"));
  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("/profile");
    }
  );

  // Chat Routes
  app.get("/chat", ensureAuthenticated, (req, res) => {
    res.render("chat", { user: req.user });
  });

  app.get("/private", ensureAuthenticated, (req, res) => {
    res.render("private", { user: req.user });
  });

  // Private Room Join
  app.post("/private", ensureAuthenticated, (req, res) => {
    const roomId = req.body.roomId.trim();
    if (!roomId) {
      return res.redirect("/private"); // Redirect back to private form if empty
    }
    res.redirect(`/private/${roomId}`);
  });

  // Dynamic Private Room Route
  app.get("/private/:roomId", ensureAuthenticated, (req, res) => {
    const roomId = req.params.roomId;
    res.render("private", { username: req.user.username, roomId });
  });

  // Dynamic Edit PRofile Route
  app.get("/edit-profile", ensureAuthenticated, (req, res) => {
    const roomId = req.params.roomId;
    res.render("edit-profile", { username: req.user });
  });
  // 404 Handler
  app.use((req, res) => {
    res.status(404).type("text").send("Not Found");
  });
};

// Middleware for Authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
