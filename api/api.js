const db = require('../db');
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
}

async function sendOtpHandler(req, res) {
  const { mobile_number,type } = req.body;
  if (!mobile_number) {
    return res.status(400).json({ success: false, message: 'Mobile number is required' });
  }

  const otp = generateOTP();

  try {
    // Insert or update OTP if mobile number already exists
    await db.execute(
      `INSERT INTO users (mobile_number, otp,verify_otp,type	)
       VALUES (?, ?,0,?)
       ON DUPLICATE KEY UPDATE otp = VALUES(otp),
         verify_otp  = VALUES(verify_otp)`,
      [mobile_number, otp,type]
    );

    console.log(`Generated OTP for ${mobile_number}: ${otp}`);

    // NOTE: Integrate SMS sending here in real use case

    res.json({ success: true, message: 'OTP sent successfully', otp }); // remove OTP from response in production
  } catch (err) {
    console.error('Error saving OTP:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function updateUserInfoHandler(req, res) {
  const {
    id,
    name,
    gender,
    dob,
    profession,
    monthly_income,
    pancard,
    adhar_number
  } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  try {
    const [result] = await db.execute(
      `UPDATE users
       SET name = ?, gender = ?, dob = ?, profession = ?, monthly_income = ?, pancard = ?, adhar_number = ?
       WHERE id = ?`,
      [name, gender, dob, profession, monthly_income, pancard, adhar_number, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log(`Updated user info for user ID ${id}`);

    res.json({ success: true, message: 'User info updated successfully' });
  } catch (err) {
    console.error('Error updating user info:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}


async function updateUserLoanHandler(req, res) {
  const {
    id,
    looking_for,
    purpose,
    loan_amount,
    tenure_months
  } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  try {
    const [result] = await db.execute(
      `UPDATE users
       SET looking_for = ?, purpose = ?, loan_amount = ?, 
       tenure_months = ?
       WHERE id = ?`,
      [ looking_for,
    purpose,
    loan_amount,
    tenure_months, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log(`Updated user Loan info for user ID ${id}`);

    res.json({ success: true, message: 'Loan info updated successfully' });
  } catch (err) {
    console.error('Error updating user info:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

const jwt = require('jsonwebtoken');

// Replace with a strong secret key in production and store it in environment variables
const JWT_SECRET = 'your_super_secret_key';

async function verifyOtpHandler(req, res) {
  const { mobile_number, otp } = req.body;

  if (!mobile_number || !otp) {
    return res.status(400).json({ success: false, message: 'Mobile number and OTP are required' });
  }

  try {
    const [rows] = await db.execute(
      `SELECT id, otp FROM users WHERE mobile_number = ?`,
      [mobile_number]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];

    if (user.otp === otp) {
      console.log(`OTP verified for ${mobile_number}`);
        // ✅ Generate JWT access token
      const tokenPayload = {
        user_id: user.id,
        mobile_number
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

      // Update otp_verify flag to 1
     await db.execute(
  `UPDATE users SET verify_otp = 1, access_token = ? WHERE mobile_number = ?`,
  [token, mobile_number]
);

    

      return res.json({
        success: true,
        message: 'OTP verified successfully',
        token
      });
    } else {
      console.log(`OTP verification failed for ${mobile_number}`);
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function logoutHandler(req, res) {
  const userId = req.user.user_id; // Comes from the JWT middleware

  try {
    // Example: update an is_logged_in flag if you use one
    await db.execute(
      `UPDATE users SET access_token = '' WHERE id = ?`,
      [userId]
    );

    console.log(`User ID ${userId} logged out`);

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Error logging out:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}


module.exports = { sendOtpHandler,updateUserInfoHandler,
  updateUserLoanHandler,verifyOtpHandler,logoutHandler };
