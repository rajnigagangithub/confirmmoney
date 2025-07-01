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

const app = express();
app.use(bodyParser.json());
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, 'uploads/logos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created directory: ${uploadDir}`);
}
app.get('/', (req, res) => {
  res.send('ConfirmMoney Backend is running!');
});
// Use OTP routes
app.use('/user', otpRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`OTP API server running on port ${PORT}`));
