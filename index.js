// Create references for libraries
var express = require('express');
var http = require('http');
var firebase = require('firebase');
var twilio = require('twilio');
var dotenv = require('dotenv');

// Express server setup
var app = express();
var server = http.createServer(app);
dotenv.load();

firebase.initializeApp({
  serviceAccount: "firebase-credentials.json",
  databaseURL: "https://mutant-office-hours-91e9d.firebaseio.com"
});
var rootRef = firebase.database().ref();

// Authenticate with twilio
var twilioClient = twilio(process.env.TWILIO_SID,
process.env.TWILIO_AUTH_TOKEN);

// Listen for new texts being added
var textsRef = rootRef.child('text');
textsRef.on('child_added', function(snapshot){
  var text = snapshot.val();
  twilioClient.messages.create({
    body: text.name + ', I am available to see you now. Please come to my office so we can discuss: "' + text.topic + '"',
    to: text.phoneNumber,  // Text this number
    from: process.env.TWILIO_PHONE // From a valid Twilio number
  }, function(err, message) {
      if(err) {
        console.log(err.message);
      }
  });
});

// Set port that is being used
server.listen(3030, function() {
  console.log('Listening on http://localhost:3030');
});
