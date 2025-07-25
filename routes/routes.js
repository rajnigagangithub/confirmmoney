const express = require('express');
const cors = require('cors');
//const admin = require("./firebaseService");

const router = express.Router();
const allowedOrigins = [
  'https://confirm.money',
  'https://www.confirm.money',
  'http://localhost:5173',
   'https://confirm-money.vercel.app/'
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
  

  methods: ['POST','GET'],
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









module.exports = router;
