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
const admin = require("firebaseService");
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

// Use OTP routes
app.use('/user', otpRoutes);
const allowedOrigins = [
  'https://confirm.money',
  'https://www.confirm.money',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      console.log('check');
    } else {
            console.log('check1');

      callback(new Error('Not allowed by CORS'));
    }
  },
  

  methods: ['POST'],
   credentials: true

};

app.use(cors(corsOptions));
admin.initializeApp({
  credential: admin.credential.applicationDefault(), // or use cert() if needed
});
app.post('/user/firebase-auth', async (req, res) => {
  const { firebase_token, mobile_number, type } = req.body;

  if (!firebase_token || !mobile_number || !type) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(firebase_token);
    const uid = decodedToken.uid;

    return res.status(200).json({
      success: true,
      message: 'User verified',
      data: { uid, mobile_number, type }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid Firebase token',
      error: error.message
    });
  }
});

// ✅ Error Handler for CORS Issues
app.use((err, req, res, next) => {
  if (err instanceof Error && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'CORS Error: Origin not allowed' });
  }
  next(err);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`OTP API server running on port ${PORT}`));
