
require('dotenv').config();

const passport = require("passport")
const bcrypt = require("bcryptjs")





module.exports = function (app, myDataBase) {

    app.route('/').get((req, res) => {
        res.render("index", {title: "Connected to Database", message: "Please log in",showLogin: true,showRegistration: true,showSocialAuth: true})
      });
    
      //post /login
    
        app.post("/login", passport.authenticate("local", { failureRedirect: "/" }), (req,res)=>{
            res.redirect("/profile")
        })
    
        app
        .route('/profile')
        .get(ensureAuthenticated, (req,res) => {
          res.render('profile',{username: req.user.username});
    
    
        app.use((req, res, next) => {
          res.status(404)
            .type('text')
            .send('Not Found');
        });
     });
    

         
    app.get("/logout",(req, res) => {
      
        req.logout();
        res.redirect('/');
    });



      //registration
  app.route('/register')
  .post((req, res, next) => {
    myDataBase.findOne({ username: req.body.username }, (err, user) => {
      if (err) {
        next(err);
      } else if (user) {
        res.redirect('/');
      } else {
        const hash = bcrypt.hashSync(req.body.password, 12);
        myDataBase.insertOne({
          username: req.body.username,
          password: hash
        },
          (err, doc) => {
            if (err) {
              res.redirect('/');
            } else {
              // The inserted document is held within
              // the ops property of the doc
              next(null, doc.ops[0]);
            }
          }
        )
      }
    })
  },
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res, next) => {
      res.redirect('/profile');
    }
  );

    app.get("/auth/github",  passport.authenticate('github'))
    app.get("/auth/github/callback",  passport.authenticate('github', { failureRedirect: '/' }), (req,res,next)=>{
        res.redirect("/chat")
    })
    app.get("/chat",ensureAuthenticated,(req,res)=>{
        res.render("chat.pug",{ user: req.user })
    })


}


        //ensure login function
function ensureAuthenticated(req, res, next) {
     if (req.isAuthenticated()) {
        return next();
         }
    res.redirect('/');
};