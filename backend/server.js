require('dotenv').config();
const twilio = require('twilio');

const cron = require('node-cron');
const nodemailer = require("nodemailer");
const User = require('./models/user_model');

const express = require('express');
const { route } = require('./router/user_router');

const userRoute = require('./router/user_router');
const contactRoute = require('./router/contact_router') 
const adminRoute = require('./router/admin_router');
const courseRoute = require('./router/courses_router');
const connectDB = require('./utils/db');

const errorMiddleware = require('./middlewares/error-middleware');

const cors = require('cors');

const app = express();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const checkLoginTimes = async () => {
    try {
      console.log("Checking login times...");
      const now = Date.now();
      const fifteenSecondsAgo = now - 60 * 1000;
      const epochTime = new Date('1970-01-01T00:00:00.000Z').getTime();
  
      const users = await User.find({ lastLogout: { $lte: fifteenSecondsAgo } });
  
      users.forEach(user => {
        console.log(user.lastLogout);
        if (new Date(user.lastLogout).getTime() !== epochTime) {
          const accId = "AC5a172b72bc34b787d5aa2f7c4c1b59dc";
          const authToken = "ce06554ff06f117da41ae49bf154276e";
          const client = twilio(accId, authToken);
  
          client.messages.create({
            from: 'whatsapp:+14155238886',
            body: 'You have been logged out from more than 15 seconds.',
            to: `whatsapp:+91${user.phone}`
          }).then(message => {
            console.log('WhatsApp message sent:', message.sid); 
          }).catch(error => {
            console.error('Error sending WhatsApp message:', error); 
          });
  
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Login Time Alert',
            text: 'You have been logged out from long time.'
          };
  
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          });
        }
      });
    } catch (error) {
      console.error('Error in checkLoginTimes:', error);
    }
  };
  

  setInterval(checkLoginTimes, 30000 * 1000);

//lets tackle cors policy
const corsOptions = {
    origin : "http://localhost:5173",
    methods : "GET, POST, PUT, DELETE, PATCH, HEAD",
    Credential : true,
}

app.use(cors(corsOptions));

app.use(express.json())                                          //Express middleware handles the json data

app.use('/api/auth', userRoute);                                      //Go to the auth-router.js run thes code on /api/auth/.....
app.use('/api/form', contactRoute);
app.use('/api/admin', adminRoute);
app.use('/api/data', courseRoute);

app.use(errorMiddleware);

const port = process.env.PORT || 8080;

// connectDB
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at port : ${port} `);
    })
})