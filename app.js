require('dotenv').config();
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});



const express = require('express');
const bodyParser = require('body-parser');
const otpRoutes = require('./routes/routes'); // fixed path here!
//const admin = require("./firebaseService");
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, 'uploads/logos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created directory: ${uploadDir}`);
}
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('ConfirmMoney Backend is running!');
});

const allowedOrigins = [
  'https://confirm.money',
  'https://www.confirm.money',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};


// Use OTP routes
app.use('/user', otpRoutes);



const PORT = 3000;
app.listen(PORT, () => console.log(`OTP API server running on port ${PORT}`));
