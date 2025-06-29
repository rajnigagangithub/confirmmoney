const express = require('express');
const bodyParser = require('body-parser');
//const otpRoutes = require('./routes/routes'); // fixed path here!

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('ConfirmMoney Backend is running!');
});
// Use OTP routes
//app.use('/user', otpRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`OTP API server running on port ${PORT}`));
