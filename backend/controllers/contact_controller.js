const Contact = require('../models/contact_model');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const twilio = require('twilio');

const Client = twilio;

const Course = require('../models/courses_model');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const contactForm = async (req, res) => {
  const { name, email, mobile, message } = req.body;

  console.log(message);

  //   const newContact = new Contact({ name, email, mobile, message });
  //   await newContact.save();

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = message;
    const result = await model.generateContent(prompt + "Give me Response in 5 lines.");
    const response = await result.response;
    const responseMessage = await response.text();

    console.log(responseMessage);

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Generated Message',
      text: responseMessage
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending email');
      } else {
        console.log('Email sent:', info.response);
        res.status(200).send('Message saved and email sent');
      }
    });

    const querywords = message.split(/\s+/);
    console.log(querywords);
    const courses = await Course.find({}).limit(10);

    const calculateMatchScore = (course) => {
      let matchScore = 0;
      const courseWords = [...course.courseName.split(/\s+/), ...course.details.split(/\s+/), ...course.tags.split(/\s+/)];
      querywords.forEach(queryword => {
        if (courseWords.includes(queryword)) {
          matchScore++;
        }
      });
      console.log(`Course: ${course.courseName}, Match Score: ${matchScore}`);
      return matchScore;
    }

    // Calculate match score for each course and sort them by their match scores
    const sortedCourses = courses
      .map(course => ({ course, matchScore: calculateMatchScore(course) }))
      .sort((a, b) => b.matchScore - a.matchScore);

    // Determine the number of top courses to select based on match scores
    const numTopCourses = sortedCourses.filter(item => item.matchScore > 0).length;

    // Select top courses
    const topCourses = sortedCourses.slice(0, numTopCourses).map(item => item.course);

    const accId = "AC5a172b72bc34b787d5aa2f7c4c1b59dc";
    const authToken = "ce06554ff06f117da41ae49bf154276e";
    const client = twilio(accId, authToken);

    // console.log("hi");

    if (topCourses.length === 0) {
      console.log("Course not found")
    }


    const courseLinks = topCourses.map(course => `https://wealthify01.vercel.app/user/courseDetails/${course._id}`).join('\n');
    const messageBody = `Response: ${responseMessage}\n\nTop Courses Based on Your Query:\n${courseLinks}`;


    client.messages.create({
      from: 'whatsapp:+14155238886',
      body: messageBody,
      to: `whatsapp:+91${mobile}`
    }).then(message => {
      console.log('WhatsApp message sent:', message.sid);
      res.status(200).send('Message saved, email sent, and WhatsApp message sent');
    }).catch(error => {
      console.error('Error sending WhatsApp message:', error);
      res.status(500).send('Error sending WhatsApp message');
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error processing request');
  }
};

const account_sid1 = 'ACe4380c547e3a4ef23cefd16c79b11d52';
const auth_token1 = '9f59b27e3591ca6fc62e46df98182192';
const client1 = new Client(account_sid1, auth_token1);

const mentorShip = async (req, res) => {
    const { user, course } = req.body;
    console.log(user.phone);
    console.log("hhhh");
    console.log(course.courseName);

    client1.calls.create({
        twiml: `<Response><Say>Hello ${user.username}, this is about the course: ${course.courseName}. So here is the information you needed about the course : ${course.details}</Say></Response>`,
        to: `91${user.phone}`,
        from: '+13612734944',
        statusCallback: 'http://yourapp.com/calls/events',
        statusCallbackMethod: 'POST'
    })
    .then(call => {
        console.log("then");
        res.status(200).send({ message: `Call initiated with SID: ${call.sid}` });
    })
    .catch(error => {
      console.log(error.message);
        res.status(500).send({ message: `Error initiating call: ${error.message}` });
    });
};

module.exports = {
  contactForm,
  mentorShip
};
