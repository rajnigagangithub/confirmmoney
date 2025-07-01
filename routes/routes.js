const express = require('express');
const router = express.Router();
const { sendOtpHandler,updateUserInfoHandler,updateUserLoanHandler,
    verifyOtpHandler,logoutHandler,getUserInfo,userdownload,addLoanOfferHandler 
,getAllLoanOffersHandler,getLoanOfferByIdHandler,updateLoanOfferHandler} = require('../api/api');
const authenticateToken = require('../middleware/auth');

router.post('/send', sendOtpHandler);
router.post('/basic-details', authenticateToken, updateUserInfoHandler);
router.post('/loan-preferences', authenticateToken, updateUserLoanHandler);
router.post('/verify-otp', verifyOtpHandler);
router.post('/logout', authenticateToken, logoutHandler);
router.get('/get-user-info', authenticateToken, getUserInfo);
router.get('/downalduser', userdownload);
router.post('/add-offers', addLoanOfferHandler);
router.get('/offer-list', getAllLoanOffersHandler);
router.get('/get-offer', getLoanOfferByIdHandler);
router.post('/update-offers', updateLoanOfferHandler);






module.exports = router;
