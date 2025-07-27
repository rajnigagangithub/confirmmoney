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
const cors = require('cors');
const admin = require("./firebaseService");

const app = express();
app.use(bodyParser.json());
const fs = require('fs');
const path = require('path');
const db = require('./db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_super_secret_key';
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
app.use('/user', cors(corsOptions), otpRoutes);
app.use(cors(corsOptions));
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(), // or use cert() if needed
// });
app.post("/user/firebase-auth", async (req, res) => {
  const { firebase_token, mobile_number, type } = req.body; // ✅ Added `otp`

  if (!firebase_token || !mobile_number || !type ) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
}

const otp = generateOTP();
 await db.execute(
  `INSERT INTO users (mobile_number, otp, type)
   VALUES (?, ?, 'credit')
   ON DUPLICATE KEY UPDATE 
     otp = VALUES(otp)`,
  [mobile_number, otp]
);
  try {
    // ✅ Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(firebase_token);
    const uid = decodedToken.uid;
    const [rows] = await db.execute(
      `SELECT id, otp,user_type FROM users WHERE mobile_number = ?`,
      [mobile_number]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];

   

      const tokenPayload = {
        user_id: user.id,
        mobile_number,
        user_type: user.user_type || 'user',
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

      // ✅ Update access_token
      await db.execute(
        `UPDATE users SET access_token = ? WHERE mobile_number = ?`,
        [token, mobile_number]
      );

      return res.status(200).json({
        success: true,
        message: "User verified",
           token:token,
            
        data: {
          uid,
          mobile_number,
          type
       
        }
      });

    

  } catch (error) {
    console.error("Firebase verification failed:", error);
    return res.status(401).json({ success: false, message: "Invalid Firebase token", error: error.message
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
