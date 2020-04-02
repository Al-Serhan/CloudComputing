const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

var mongoose = require('mongoose');
var path = require('path');
var awsIot = require('aws-iot-device-sdk');
var espmessage = ""





var device = awsIot.device({
  keyPath: "C:\\nodejs\\MiniProject\\certs\\01e487d532-private.pem.key",
  certPath: "C:\\nodejs\\MiniProject\\certs\\01e487d532-certificate.pem.crt.txt",
  caPath: "C:\\nodejs\\MiniProject\\certs\\root-CA.crt",
  clientId: "qwerty",
  host: "audchunlsnrmi-ats.iot.us-east-1.amazonaws.com"
});

device
  .on('connect', function() {
    console.log('connect');
    device.subscribe('$aws/things/DHT11_Demo/shadow/update');
    device.publish('$aws/things/DHT11_Demo/shadow/update', JSON.stringify({ test_data: 1}));
  });

device
  .on('message', function(topic, payload) {
    espmessage = payload.toString();
    console.log('message', topic, payload.toString());
  });

//ESP Data
  router.get('/getHumidity', function(req, res, next) {
  //var q = url.parse(req.url, true);
  res.send("" + espmessage);
});



// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));


// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

module.exports = router;
