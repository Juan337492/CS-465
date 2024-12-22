const express = require('express'); //express app
const router = express.Router();
const jwt = require("jsonwebtoken");

// where we import the controllers we will route
const authController = require('../controllers/authentication');
const tripsController = require('../controllers/trips');


// Method to authenticate our JWT
function auth(req, res, next) {
    // console.log('In Middleware');
    const authHeader = req.headers["authorization"];
    // console.log('Auth Header: ' + authHeader);
    if (authHeader == null) {
      console.log("Auth Header Required but NOT PRESENT!");
      return res.sendStatus(401);
    }
    let headers = authHeader.split(" ");
    if (headers.length < 1) {
      console.log("Not enough tokens in Auth Header: " + headers.length);
      return res.sendStatus(501);
    }
    const token = authHeader.split(" ")[1];
    // console.log('Token: ' + token);
    if (token == null) {
      console.log("Null Bearer Token");
      return res.sendStatus(401);
    }
    // console.log(process.env.JWT_SECRET);
  
    // console.log(jwt.decode(token));
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, verified) => {
        if (err) {
          return res.sendStatus(401).json("Token Validation Error!");
        }
        req.auth = verified; // Set the auth paramto the decoded object
      }
    );
    next(); // We need to continue or this will hang forever
  }

// define route for trips endpoint
router
    .route('/login')
    .post(authController.login);

router
    .route('/register')
    .post(authController.register);

router
    .route('/trips')
    .get(tripsController.tripsList) //Get Method routes tripList
    .post(auth, tripsController.tripsAddTrip); //Post Method Adds a Trip

router
    .route('/trips/:tripCode') 
    .get(tripsController.tripsFindByCode)
    .put(auth, tripsController.tripsUpdateTrip);


module.exports = router;