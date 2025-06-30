const express = require('express');
const router = express.Router();
const { sendOtpHandler,updateUserInfoHandler,updateUserLoanHandler,
    verifyOtpHandler,logoutHandler,getUserInfo } = require('../api/api');
const authenticateToken = require('../middleware/auth');

router.post('/send', sendOtpHandler);
router.post('/basic-details', authenticateToken, updateUserInfoHandler);
router.post('/loan-preferences', authenticateToken, updateUserLoanHandler);
router.post('/verify-otp', verifyOtpHandler);
router.post('/logout', authenticateToken, logoutHandler);
router.get('/get-user-info', authenticateToken, getUserInfo);





module.exports = router;
