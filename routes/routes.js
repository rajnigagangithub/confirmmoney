const express = require('express');
const cors = require('cors');

const router = express.Router();
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

const { sendOtpHandler,updateUserInfoHandler,updateUserLoanHandler,
    verifyOtpHandler,logoutHandler,getUserInfo,userdownload,addLoanOfferHandler 
,getAllLoanOffersHandler,getLoanOfferByIdHandler,updateLoanOfferHandler} = require('../api/api');
const authenticateToken = require('../middleware/auth');

router.post('/send', cors(corsOptions), sendOtpHandler);
router.post('/basic-details', cors(corsOptions), authenticateToken, updateUserInfoHandler);
router.post('/loan-preferences', cors(corsOptions), authenticateToken, updateUserLoanHandler);
router.post('/verify-otp', cors(corsOptions), verifyOtpHandler);
router.post('/logout', cors(corsOptions), authenticateToken, logoutHandler);
router.get('/get-user-info', cors(corsOptions), authenticateToken, getUserInfo);
router.get('/downalduser', cors(corsOptions), userdownload);
router.post('/add-offers', cors(corsOptions),addLoanOfferHandler);
router.get('/offer-list', cors(corsOptions), getAllLoanOffersHandler);
router.get('/get-offer', cors(corsOptions),getLoanOfferByIdHandler);
router.post('/update-offers', cors(corsOptions), updateLoanOfferHandler);


router.post('/user/firebase-auth', cors(corsOptions), async (req, res) => {
  const { firebase_token, mobile_number, type } = req.body;

  if (!firebase_token || !mobile_number || !type) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(firebase_token);
    const uid = decodedToken.uid;

    return res.status(200).json({
      success: true,
      message: "User verified",
      data: { uid, mobile_number, type }
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Firebase token",
      error: error.message
    });
  }
});





module.exports = router;
